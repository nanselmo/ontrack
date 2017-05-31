from django.shortcuts import render, redirect
from student.models import Grade, Student, Attendance, Email, Subject, Roster, DataFile, Assignment
from allauth.socialaccount.models import SocialAccount
from django.db import connection
from ontrack import get_user_info, getOnTrack, getPoints, get_attend_pct, get_gpa, get_test_score, gpa_subjects_list, take_out_subjects_list, get_grade_distribution
#from grade_audit import generate_grade_audit
from classdata import hr_data
from summerschool import get_ss_report
from assignmentimpact import get_assign_impact
from loadOnTrackData import *
import pandas
import math
import numpy as np
#streaming is for large datasets
from django.http import HttpResponseRedirect, HttpResponse, StreamingHttpResponse
from forms import DataFileForm
import csv
from StringIO import StringIO
import json
from pandas.io.json import json_normalize


#for plotting
import gviz_api
from django.shortcuts import render
from django.db import connection

#debug
#import pdb;
#







def summer_school(request):
    if request.method == 'POST':
        #DataFileForm is a class defined in forms.py
        upload_form = DataFileForm(request.POST, request.FILES)
        if upload_form.is_valid():
                file_list=request.FILES.getlist('document')
                #returns two dataframes with summer school status (using the uploaded files)
                full_roster, ss_list=get_ss_report(file_list, in_mem=True)
                #save the dataframes in the session - but must be saved as JSON
                request.session['ss_kids'] = ss_list.to_json()
                request.session['full_roster'] = full_roster.to_json()
                #go to the success page
                return redirect( 'download_ss')

    else:
            #an empty form
            upload_form = DataFileForm()
            message="Upload a File"


    return render(request, 'student/summerschool.html', {'display_form': upload_form})

def show_test_react(request):

    return render(request, 'student/test-react.html')

def download_summer_school(request):
    ss_kids = request.session.get('ss_kids', None)
    full_roster = request.session.get('full_roster', None)

    #in converting to JSON, the column order of the DF is messed up. here we reorder it
    ideal_order=['StudentID',
                 'StudentFirstName',
                 'StudentLastName',
                 'StudentHomeroom',
                 'StudentGradeLevel',
                 'ELL',
                 'LRE',
                 'ARS',
                 'PDIS',
                 'R_Grade',
                 'M_Grade',
                 'NWEA_R_High',
                 'NWEA_M_High',
                 'SSS',
                 'SS_Description',
                 'SSW',
                 'Warning_Desc']
    full_roster=pandas.read_json(full_roster)[ideal_order].sort_values(by=['StudentGradeLevel', 'SSS', 'StudentHomeroom'])
    ss_list=pandas.read_json(ss_kids)[ideal_order].sort_values(by=['StudentGradeLevel', 'SSS', 'StudentHomeroom'])
    if request.method == 'POST':
        filename="summer-school-roster.xlsx"
        sio = StringIO()
        writer = pandas.ExcelWriter(sio, engine='xlsxwriter')
        ss_codes_df = pandas.DataFrame({'Codes': ['0A', '0B', '1A', '1B', '2A', '2B', '3A', '3B'],
                                    'Description': ['ELL - No Summer School',
                                    'ELL-Summer School',
                                    '24% - No Summer School',
                                    '24% - Summer School, No Exam',
                                     '11-23% -  No Summer School',
                                     '11-23% -Summer School and Exam',
                                     '<10% - Summer School and Exam',
                                      '<10% - Summer School and Exam']})
        ss_codes_df.to_excel(writer, sheet_name='Summer School Codes')
        full_roster.to_excel(writer, sheet_name="Full-Roster", index=False)
        ss_list.to_excel(writer, sheet_name="SS-Roster", index=False)

        writer.save()
        sio.seek(0)
        workbook = sio.getvalue()
        response = HttpResponse(workbook, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=%s' % filename
        return (response)
    else:
        #display the data on the page
        ss_kids_df=ss_list
        ss_kids_df=ss_kids_df[['StudentFirstName', 'StudentLastName', 'StudentGradeLevel',
        'StudentHomeroom', 'SSS', 'SS_Description', 'SSW', 'Warning_Desc']]
        ss_kids_html=ss_kids_df.to_html()
        return render(request, 'student/summerschoolresults.html', {'ss_list' : ss_kids_html})


def upload_files(request):

    if request.user.is_authenticated:
        user_id, user_type=get_user_info(request)
        if user_type == "School Admin":
            #handle file upload
            if request.method == 'POST':
                #DataFileForm is a class defined in forms.py
                upload_form = DataFileForm(request.POST, request.FILES)
                if upload_form.is_valid():
                    message=""
                    for each_file in request.FILES.getlist('document'):
                        newfile = DataFile(document = each_file)
                        print each_file
                        if "Grade" in str(each_file):
                            num_data_points=loadGrades(newfile, inMemory=True)
                            message= message + str(num_data_points) + " grades have been updated. "
                        elif "Attend" in str(each_file):
                            num_data_points=loadAttendance(newfile, inMemory=True)
                            message= message + str(num_data_points) + " attendance records have been updated. "
                        elif "Email" in str(each_file):
                            num_data_points=loadEmail(newfile, inMemory=True)
                            message= message + str(num_data_points) + " emails records have been updated. "
                        elif "Assign" in str(each_file):
                            num_data_points=loadAssignments(newfile, inMemory=True)
                            message= message + str(num_data_points) + " assignments have been updated. "
                        elif "SIM" in str(each_file):
                            num_data_points=loadStudents(newfile, inMemory=True)
                            message= message + str(num_data_points) + " students have been updated. "
                        elif "NWEA" in str(each_file):
                            num_data_points=loadNWEA(newfile, inMemory=True)
                            message= message + str(num_data_points) + " test scores have been updated. "
                        elif "ST" in str(each_file):
                            num_data_points=loadJiJi(newfile, inMemory=True)
                            message= message + str(num_data_points) + " students in JiJi have been updated. "

                        else:
                            num_data_points=0
                            message=message+ str(each_file) + " not named correctly. Please rename it with the convention Grades-XX-XX-XX.csv or Attendance-XX-XX-XX.csv"
                        #no longer need to show the upload form
                    upload_form=""

            else:
                    #an empty form
                    upload_form = DataFileForm()
                    message="Upload Your School's Files"
        else:
            upload_form=""
            message= "You must be an administrator to upload a file"


        return render(request, 'student/uploadFiles.html', {'display_form': upload_form, 'upload_message': message})


    #if user is not logged in
    else:
        social_email= "none"
        return render(request, "student/home.html", {'social_email': social_email})



def grade_report(request):
    #commented out on 04/26/17 because python anywhere is having trouble finding
    #the teacher_div file, need to set student_data in a static directory or
    #move teacher_div to a database
    #template_vars= generate_grade_audit(num="admin")

    if request.method == 'POST':
        #DataFileForm is a class defined in forms.py
        upload_form = DataFileForm(request.POST, request.FILES)
        if upload_form.is_valid():
                file_list=request.FILES.getlist('document')

                #save the dataframes in the session - but must be saved as JSON
                #request.session['ss_kids'] = ss_list.to_json()
                #request.session['full_roster'] = full_roster.to_json()
                #go to the success page
                #return redirect('download_ss')

    else:
            #an empty form
            upload_form = DataFileForm()
            #message="Upload The Grades Files"

    template_vars = {}

    return render(request, "student/grade_report.html", template_vars)






def show_home(request):
    try:
        if request.user.is_authenticated:
            social_email = SocialAccount.objects.get(user=request.user).extra_data['email']
            user_id, user_type=get_user_info(request)
            if user_type in ["School Admin", "Teacher"]:
                hr_dict = Roster.objects.values('hr_id',
                                                            'grade_level').distinct().order_by('grade_level')
                prev_grade=0
                display_hr_list=[]

                for hr in hr_dict:
                    if (hr['grade_level'] not in ["20","PE","PK"]) & (hr['hr_id'] not in ["1","2"]):
                        cur_grade="GR: "+hr['grade_level']
                        if (cur_grade!=prev_grade) :
                            display_hr_list.append(cur_grade)

                        display_hr_list.append(hr['hr_id'])
                        prev_grade=cur_grade
            else:
                display_hr_list=""

        else:
            social_email= "none"
            display_hr_list=""






        return render(request, "student/home.html", {'social_email': social_email,
         'display_hr_list': display_hr_list })

    except SocialAccount.DoesNotExist:
        return render(request, 'student/no-match-found.html')



def show_dashboard(request, student_id=1):
    lookup_user_id, user_type=get_user_info(request, student_id)
    return render(request, "student/dashboard.html", {'user_email': lookup_user_id})

def show_hr(request, selected_hr="B314"):

    if request.user.is_authenticated:
        user_id, user_type = get_user_info(request)

    if user_type in ["School Admin", "Teacher"] and selected_hr=="All":
        hr_json, hr_dict = hr_data(selected_hr, admin=True)
        title = "All Students"
        grade_distribution_array, avg_grades_list=get_grade_distribution(selected_hr)
        #don't draw pie graphs for All
        grade_distribution_array=[]

        #JiJi summary, move this to a method
        current_stmath_sql="SELECT first_name, last_name, hr_id, gcd, k_5_progress, curr_hurdle, total_time, curr_objective, MAX(metric_date) as recent_date \
                  FROM student_roster, student_stmathrecord, student_student \
                  WHERE student_stmathrecord.student_id=student_roster.student_id AND\
                  student_roster.student_id=student_student.student_id\
                  GROUP BY  student_roster.student_id\
                  ORDER BY k_5_progress"
        df_stmath_all = pandas.read_sql(current_stmath_sql, con=connection)
        if len(df_stmath_all) > 0:
            all_stmath_values=df_stmath_all.values
            all_stmath_desc=[("first_name", "string", "First Name"),
                          ("last_name", "string", "Last Name"),
                           ("hr_id", "string", "HR"),
                          ("gcd", "string", "Level"),
                         ("k_5_progress", "number", "Syllabus Progress"),
                         ("curr_hurdle", "number", "Current Hurdle Tries"),
                          ("total_time", "number", "Total Time"),
                         ("cur_objective", "string", "Current Objective"),
                            ("recent_date", "string", "Data As Of")]
            all_stmath_gviz_data_table=gviz_api.DataTable(all_stmath_desc)
            all_stmath_gviz_data_table.LoadData(all_stmath_values)
            all_stmath_gviz_json=all_stmath_gviz_data_table.ToJSon()
        #if there is no data in df_stmath_all
        else:
            all_stmath_gviz_json={}

        #last two ST math dates for stacked bar graph
        last_two_stmath_sql="SELECT  first_name || ' ' || last_name || ' '||student_student.student_id  AS full_name, gcd, k_5_progress, metric_date\
                  FROM student_roster, student_stmathrecord, student_student \
                  WHERE student_stmathrecord.student_id=student_roster.student_id AND\
                  student_roster.student_id=student_student.student_id AND\
                  metric_date IN (SELECT  metric_date\
                 FROM student_stmathrecord\
                 GROUP BY metric_date\
                 ORDER BY metric_date DESC\
                 LIMIT 2)\
                  ORDER BY -metric_date"
        df_stmath_two_dates = pandas.read_sql(last_two_stmath_sql, con=connection)
        if len(df_stmath_two_dates) > 0:
            df_stmath_two_dates = df_stmath_two_dates.pivot(index="full_name", columns="metric_date", values="k_5_progress").reset_index()
            df_stmath_two_dates['total_progress'] =  df_stmath_two_dates.ix[:,2]
            df_stmath_two_dates = df_stmath_two_dates.sort_values(['total_progress'] , ascending=[False])

            df_stmath_two_dates['prev_progress'] =  df_stmath_two_dates.ix[:,1]
            df_stmath_two_dates['recent_progress'] =  df_stmath_two_dates['total_progress'] - df_stmath_two_dates['prev_progress']
            df_stmath_two_dates = df_stmath_two_dates[['full_name', 'prev_progress', 'recent_progress']]
            #break into the names of each column (the dates) and the values in order to feed into Gviz' DataTable

            #first get the names of each column, convert them to strings and add them to a new array
            col_names=list(df_stmath_two_dates)


            #get the values of the data frame (the progress each student had made)
            stmath_two_dates_values=df_stmath_two_dates.values

            #join these two arrays together
            last_two_stdates_data=np.vstack((col_names,stmath_two_dates_values))

            last_two_stdates_data_list=last_two_stdates_data.tolist()



            last_two_stdates_data_json = json.dumps(last_two_stdates_data_list)
        else:
            last_two_stdates_data_json = ""


    #just select data from one homeroom
    elif user_type in ["School Admin", "Teacher"] :
        hr_json, hr_dict=hr_data(selected_hr, admin=False)
        title=selected_hr + ' Students'
        grade_distribution_array, avg_grades_list = get_grade_distribution(selected_hr)



        current_stmath_sql="SELECT first_name, last_name, gcd, k_5_progress, curr_hurdle, total_time, curr_objective, MAX(metric_date) as recent_date \
                  FROM student_roster, student_stmathrecord, student_student \
                  WHERE student_stmathrecord.student_id=student_roster.student_id AND\
                  student_roster.student_id=student_student.student_id AND\
                  student_roster.hr_id='%s'\
                  GROUP BY  student_roster.student_id\
                  ORDER BY k_5_progress"%(selected_hr)


        df_stmath_all = pandas.read_sql(current_stmath_sql, con=connection)
        if len(df_stmath_all) > 0:
            all_stmath_values=df_stmath_all.values
            all_stmath_desc=[("first_name", "string", "First Name"),
                          ("last_name", "string", "Last Name"),
                          ("gcd", "string", "Level"),
                         ("k_5_progress", "number", "Syllabus Progress"),
                         ("curr_hurdle", "number", "Current Hurdle Tries"),
                          ("total_time", "number", "Total Time"),
                         ("cur_objective", "string", "Current Objective"),
                            ("recent_date", "string", "Data As Of")]
            all_stmath_gviz_data_table=gviz_api.DataTable(all_stmath_desc)
            all_stmath_gviz_data_table.LoadData(all_stmath_values)
            all_stmath_gviz_json=all_stmath_gviz_data_table.ToJSon()
        else:
            all_stmath_gviz_json={}

        #get the stmath progress over time for all students in a hr for stacked bar
        # historical_stmath_sql="SELECT  first_name || ' ' || last_name AS full_name, gcd, k_5_progress, metric_date\
        #           FROM student_roster, student_stmathrecord, student_student \
        #           WHERE student_stmathrecord.student_id=student_roster.student_id AND\
        #           student_roster.student_id=student_student.student_id AND\
        #           student_roster.hr_id='%s'\
        #           ORDER BY -metric_date"%(selected_hr)
        # df_stmath_hist = pandas.read_sql(historical_stmath_sql, con=connection)
        # df_stmath_hist.groupby('full_name').head(3).reset_index(drop=True)
        # df_stmath_dates=df_stmath_hist.pivot(index="full_name", columns="metric_date", values="k_5_progress").reset_index()
        #
        # #break into the names of each column (the dates) and the values in order to feed into Gviz' DataTable
        #
        # #first get the names of each column, convert them to strings and add them to a new array
        # col_names=list(df_stmath_dates)
        # names_strings = []
        # for name in col_names:
        #     try:
        #         names_strings.append(name.strftime("%m-%d"))
        #     except:
        #         names_strings.append(name)
        # col_names_array=np.asarray(names_strings)
        #
        # #get the values of the data frame (the progress each student had made)
        # stmath_dates_values=df_stmath_dates.values
        #
        # #join these two arrays together
        # full_stdates_data = np.vstack((col_names_array,stmath_dates_values))
        # full_stdates_data = full_stdates_data.tolist()

        #only want the last two dates of ST progress
        last_two_stmath_sql="SELECT  first_name || ' ' || last_name AS full_name, gcd, k_5_progress, metric_date\
                  FROM student_roster, student_stmathrecord, student_student \
                  WHERE student_stmathrecord.student_id=student_roster.student_id AND\
                  student_roster.student_id=student_student.student_id AND\
                  student_roster.hr_id='%s' AND\
                  metric_date IN (SELECT  metric_date\
                 FROM student_stmathrecord\
                 GROUP BY metric_date\
                 ORDER BY metric_date DESC\
                 LIMIT 2)\
                  ORDER BY -metric_date"%(selected_hr)
        df_stmath_two_dates = pandas.read_sql(last_two_stmath_sql, con=connection)
        if len(df_stmath_two_dates) > 0:
            df_stmath_two_dates = df_stmath_two_dates.pivot(index="full_name", columns="metric_date", values="k_5_progress").reset_index()
            df_stmath_two_dates['total_progress'] =  df_stmath_two_dates.ix[:,2]
            df_stmath_two_dates = df_stmath_two_dates.sort_values(['total_progress'] , ascending=[False])

            df_stmath_two_dates['prev_progress'] =  df_stmath_two_dates.ix[:,1]
            df_stmath_two_dates['recent_progress'] =  df_stmath_two_dates['total_progress'] - df_stmath_two_dates['prev_progress']
            df_stmath_two_dates = df_stmath_two_dates[['full_name', 'prev_progress', 'recent_progress']]
            #break into the names of each column (the dates) and the values in order to feed into Gviz' DataTable

            #first get the names of each column, convert them to strings and add them to a new array
            col_names=list(df_stmath_two_dates)


            #get the values of the data frame (the progress each student had made)
            stmath_two_dates_values=df_stmath_two_dates.values

            #join these two arrays together
            last_two_stdates_data=np.vstack((col_names,stmath_two_dates_values))

            last_two_stdates_data_list=last_two_stdates_data.tolist()



            last_two_stdates_data_json = json.dumps(last_two_stdates_data_list)
        else:
            last_two_stdates_data_json = ""
    #if not authenticated
    else:
        hr_dict = {}
        hr_json = ""
        title = "Not Authorized"
        grade_distribution_array = []
        all_stmath_gviz_json = {}
        full_stdates_data = []
        last_two_stdates_data_json = ""



    template_vars={
                'hr_dict': hr_dict,
                 'hr_json':hr_json,
                 'title': title,
                 'grade_distribution_array': json.dumps(grade_distribution_array),
                 'avg_grades' : json.dumps(avg_grades_list),
                 'all_stmath_gviz_json' : all_stmath_gviz_json,
                 'stmath_dates_json' : last_two_stdates_data_json
                 }
    return render(request, "student/homeroom.html", template_vars)

def show_student(request, student_id=1):
        this_student_id, user_type=get_user_info(request, student_id)
        student=Student.objects.get(student_id= "%s"%(this_student_id))


        #get gpa for get_gpa method (in ontrack.py)
        student_gpa=get_gpa(this_student_id, "current", "student")['gpa']

        gpa=student_gpa['current_gpa']

        #set up Google Table to pass to View
        gpa_desc=[("grade_date", "date", "Date" ),
                  ("gpa", "number", "GPA")]
        gpa_data_table=gviz_api.DataTable(gpa_desc)
        gpa_data_table.LoadData(student_gpa['values'])
        gpa_json=gpa_data_table.ToJSon()

        #Attendance
        attend_pct=get_attend_pct(this_student_id)
        onTrack = getOnTrack(attend_pct, gpa)

        #format the numbers as strings
        gpa_as_string='{:.2f}'.format(float(gpa))
        attend_as_string='{0:g}'.format(float(attend_pct))
        template_vars = {'current_gpa': gpa_as_string,
                         'current_student' : student ,
                         'gpa_json_data' : gpa_json,
                         'attendance_pct' : attend_as_string,
                         'ontrack' : onTrack,
                         'student_id': student_id}
        return render(request, 'student/student.html',template_vars )



def show_student_ontrack(request, student_id=1):
        student_id, user_type=get_user_info(request, student_id)

        student=Student.objects.get(student_id= "%s"%(student_id))
        template_vars={'current_student': student}
        return render(request, "student/student_ontrack.html", template_vars)


def show_hs_options(request, student_id=1 ):
    student_id, user_type=get_user_info(request, student_id)

    student=Student.objects.get(student_id= "%s"%(student_id))

    #hardcode tier for now
    tier=2

    student=Student.objects.get(student_id= "%s"%(student_id))
    current_grades_df=get_gpa(student_id, "current", "student")['grades_df']
    current_grades_dict=current_grades_df.set_index('display_name').to_dict('index')


    nwea_scores=get_test_score(student_id , "NWEA")



    #still need to change this to default to an A for 8th grade SS
    def total_hs_points(grade_dict, nwea_score_dict):

        def get_points(num):
            ib_points=0
            ses_points=0
            if(num>=91):
                ses_points=75
                ib_points=112.5
            elif(num>=81):
                ses_points=50
                ib_points=75
            elif(num>=71):
                ses_points=25
                ib_points=38
            else:
                ses_points=0
                ib_points=0
            return({'ib': ib_points, 'ses':ses_points})


        #get the points for each letter grade
        tot_ib=0
        tot_ses=0
        for subject, info in grade_dict.items():
                tot_ib=tot_ib+get_points(info['grade'])['ib']
                tot_ses=tot_ses+get_points(info['grade'])['ses']

        #total points are the points awarded by letter grade plus a factor times the NWEA percentiles
        if nwea_score_dict['math_pct'] != "not available":
            tot_ib=tot_ib+2.2727*int(nwea_score_dict['math_pct'])
            tot_ses=tot_ses + 1.515*int(nwea_score_dict['math_pct'])
        if nwea_score_dict['read_pct'] != "not available":
            tot_ib=tot_ib + 2.2727*int(nwea_score_dict['read_pct'])
            tot_ses=tot_ses + 1.515*int(nwea_score_dict['read_pct'])
        return({'ib_totl': tot_ib, 'ses_totl': tot_ses })

    points=total_hs_points(current_grades_dict, nwea_scores)

    hs_sql = "SELECT * from student_highschool"

    hs_df_raw = pandas.read_sql(hs_sql, con=connection)
    hs_df = hs_df_raw[hs_df_raw['tier1_points']>0]

    def getAppPts(row):
        admit_pts=0
        student_pts=0
        #get how many points that school needs for admission
        if tier == 1 or row['school_type']=="IB":
            admit_pts=row['tier1_points']
        elif tier == 2:
            admit_pts=row['tier2_points']
        elif tier == 3:
            admit_pts=row['tier3_points']
        elif tier == 4:
            admit_pts=row['tier4_points']

        #test score is out of 300, assume students get at least a 60% on it
        admit_pts=admit_pts-200

        #subtract the total they need from what they have
        if row['school_type']=="IB":
            student_pts = admit_pts - points['ib_totl']
        elif row['school_type']=="SES":
            student_pts = admit_pts - points['ses_totl']


        return(int(round(student_pts)))

    hs_df['RemainingPts'] = hs_df.apply(lambda row: getAppPts(row), axis=1)
    hs_df=hs_df.sort_values('RemainingPts', ascending=True)
    hs_df.index = range(1,len(hs_df) + 1)
    student_hs_dict=hs_df.to_dict(orient='index')

    template_vars={'current_student': student,
        'hs_dict':student_hs_dict,
        'ses_points': points["ses_totl"],
        'ib_points': points["ib_totl"],
        'student_id':student_id,
        'current_grades_dict': current_grades_dict,
        'nwea_math' : nwea_scores["math_pct"],
        'nwea_reading' : nwea_scores["read_pct"]}
    return render(request, "student/student_calc.html", template_vars)



def show_student_grades(request, student_id=1):

        student_id, user_type=get_user_info(request, student_id)
        student=Student.objects.get(student_id= "%s"%(student_id))

        current_core_grades_df=get_gpa(student_id, "current", "student")['grades_df']
        #put into dictionary to use in student_grades.html template
        current_core_grades_dict=current_core_grades_df.set_index('display_name').to_dict('index')



        historical_core_grades_df=get_gpa(student_id, "historical")['grades_df']
        subject_names=list(historical_core_grades_df.columns.values)
        historical_core_grades_df.insert(0,'date', historical_core_grades_df.index)
        all_grades_data=historical_core_grades_df.values


        ##pass grades data to Google Viz
        #description/header  table for Google Viz
        grades_desc =[]
        grades_desc.append(("grade_date", "date", "Date" ))
        for index,subject in enumerate(subject_names):
            grades_desc.append( ("subj"+str(index+1), "number", subject))

        # Loading it into gviz_api.DataTable
        all_grades_data_table = gviz_api.DataTable(grades_desc)
        all_grades_data_table.LoadData(all_grades_data)
        historical_grades_json = all_grades_data_table.ToJSon()
        historical_grades_json


        gpa_values=get_gpa(student_id, "current")['gpa']['values']

        #set up Google Table to pass to View
        gpa_desc=[("grade_date", "date", "Date" ),
                  ("gpa", "number", "GPA")]
        gpa_data_table=gviz_api.DataTable(gpa_desc)
        gpa_data_table.LoadData(gpa_values)
        gpa_json=gpa_data_table.ToJSon()


        template_vars = {'current_core_grades_dict': current_core_grades_dict,
                         'current_student' : student ,
                         'all_grades_json' : historical_grades_json,
                         'gpa_json_data' : gpa_json,
                         'fake_cum_grade' : "99",
                         'student_id': student_id}
        return render(request, 'student/student_grades.html',template_vars )


def show_student_assignments(request, student_id=1, display_subject="Math"):
    student_id, user_type=get_user_info(request, student_id)
    student=Student.objects.get(student_id= "%s"%(student_id))
    long_subject=Subject.objects.get(display_name=display_subject).subject_name

    if display_subject == "Math":


        stmath_sql = "Select metric_date, k_5_progress \
        FROM student_stmathrecord WHERE student_id = '%s'" %(student_id)
        df_stmath = pandas.read_sql(stmath_sql, con=connection)

        if len(df_stmath)> 0:
            curJiJi = STMathRecord.objects.filter(student=student_id).order_by('-metric_date')[0].k_5_progress

            #get the values from the df and define the columns of the datatable
            stmath_values=df_stmath.values
            description = [("metric_date", "date", "Date"),
            ("k_5_progress", "number", "Syllabus Progress")]

            # Loading it into gviz_api.DataTable and covert to JSON
            st_math_data_table = gviz_api.DataTable(description)
            st_math_data_table.LoadData(stmath_values)

            #stmath_values
            st_math_gviz_json = st_math_data_table.ToJSon()
        else:
            st_math_gviz_json = {}
            #JiJi summary, move this to a method
            curJiJi = []
    else:
        st_math_gviz_json = {}
        curJiJi = []



    if get_assign_impact(student_id, long_subject) != "No assignments":
        assign_clean_df, assign_summary_df = get_assign_impact(student_id, long_subject)
        #set up gviz
        summary_values=assign_summary_df.values
        summary_desc=[("Category", "string", "Category"),
                      ("Weight", "string", "Weight"),
                      ("NumGrades", "string", "Total Assignments"),
                     ("Points", "number", "Points Earned"),
                     ("PointsPossible", "number", "Points Possible"),
                      ("Pct", "number", "Percent of Points"),
                     ("TotImpact", "number", "Impact")]
        summary_gviz_data_table=gviz_api.DataTable(summary_desc)
        summary_gviz_data_table.LoadData(summary_values)
        summary_gviz_json=summary_gviz_data_table.ToJSon()

        assign_values=assign_clean_df.values
        assign_desc=[("Assignment", "string", "Assignment"),
                      ("Score", "number", "Score"),
                      ("ScorePossible", "number", "Possible Score"),
                      ("Pct", "number", "Percent"),
                       ("Category", "string", "Category"),
                      ("Impact", "number", "Impact")]
        assign_gviz_data_table=gviz_api.DataTable(assign_desc)
        assign_gviz_data_table.LoadData(assign_values)
        assign_gviz_json=assign_gviz_data_table.ToJSon()

        return render(request, 'student/student_assignments.html',
                                {'student' : student,
                                'assign_gviz_json' : assign_gviz_json,
                                'summary_gviz_json' : summary_gviz_json,
                                'assign_list_dict' :assign_clean_df.to_dict(orient="index"),
                                'assign_summary_dict' : assign_summary_df.to_dict(orient="index"),
                                'stmath_gviz_json' : st_math_gviz_json,
                                'curJiJi': curJiJi} )

    else:
        return render(request, 'student/student_assignments.html',
                                {'student' : student,
                                'stmath_gviz_json' : st_math_gviz_json} )




def show_student_attendance(request, student_id=1):

        student_id, user_type=get_user_info(request, student_id)


        student=Student.objects.get(student_id= "%s"%(student_id))
        attend_data=Attendance.objects.filter(student_id="%s"%(student_id)).order_by('-attend_date')[0]
        attend_pct=round(attend_data.calc_pct())
        attend_sql="Select attend_date, absent_days \
        FROM student_attendance WHERE student_id=%s"%(student_id)
        df_attend = pandas.read_sql(attend_sql, con=connection)
        attend_data_matrix=df_attend.as_matrix() #<--maybe just use values.tolist() here?

        #make Google Viz' DataTable schema to describe the columns
        description = [("attend_date", "date", "Date" ),
                   ("absent_days", "number", "Absences")]

        # Load the schema and data
        attend_data_table = gviz_api.DataTable(description)
        attend_data_table.LoadData(attend_data_matrix)

        #turn into json to pass to the template
        attend_json = attend_data_table.ToJSon()

        template_vars={ 'current_student': student,
                        'current_attend_pct': attend_pct,
                        'attend_json_data': attend_json,
                        'attend_data': attend_data,
                        'student_id':student_id}

        return render(request, "student/student_attendance.html", template_vars)
