from django.shortcuts import render, redirect
from student.models import Grade, Student, Attendance, Email, Subject, Roster, DataFile, Assignment
from allauth.socialaccount.models import SocialAccount
from django.db import connection
from ontrack import get_user_info, getOnTrack, getPoints, get_attend_pct, get_gpa, get_test_score, gpa_subjects_list, take_out_subjects_list, get_grade_distribution
from grade_audit import generate_grade_audit
from classdata import hr_data
from summerschool import get_ss_report
from assignmentimpact import get_assign_impact
from loadOnTrackData import *
import pandas
import math
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




grade_hr_dict = Roster.objects.values('hr_id',
                                            'grade_level').distinct().order_by('grade_level')


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
    template_vars=generate_grade_audit(num="admin")
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


    return render(request, "student/grade_report.html", template_vars)






def show_home(request):
    try:
        if request.user.is_authenticated:
            social_email = SocialAccount.objects.get(user=request.user).extra_data['email']
            user_id, user_type=get_user_info(request)
            if user_type in[ "School Admin","Teacher"]:
                hr_dict=grade_hr_dict
            else:
                hr_dict="none"

        else:
            social_email= "none"
            hr_dict="none"
        exclude_hr_list=["1", "2"]
        exclude_grade_list=["PK", "PE", "20"]

        prev_grade=0
        display_hr_list=[]
        for hr in grade_hr_dict:
            if (hr['grade_level'] not in ["20","PE","PK"]) & (hr['hr_id'] not in ["1","2"]):
                cur_grade="GR: "+hr['grade_level']
                if (cur_grade!=prev_grade) :
                    display_hr_list.append(cur_grade)

                display_hr_list.append(hr['hr_id'])
                prev_grade=cur_grade


        return render(request, "student/home.html", {'social_email': social_email,
         'display_hr_list': display_hr_list})

    except SocialAccount.DoesNotExist:
        return render(request, 'student/no-match-found.html')



def show_dashboard(request, student_id=1):
    lookup_user_id, user_type=get_user_info(request, student_id)
    return render(request, "student/dashboard.html", {'user_email': lookup_user_id})

def show_hr(request, selected_hr="B314"):

    if request.user.is_authenticated:
        user_id, user_type=get_user_info(request)
    if user_type in ["School Admin", "Teacher"] and selected_hr=="All":
        hr_json, hr_dict=hr_data(selected_hr, admin=True)
        title="All Students"
        grade_distribution_array, avg_grades_list=get_grade_distribution(selected_hr)
        #don't draw pie graphs for All
        grade_distribution_array=[]


    elif user_type in ["School Admin", "Teacher"] :
        hr_json, hr_dict=hr_data(selected_hr, admin=False)
        title=selected_hr + ' Students'
        grade_distribution_array, avg_grades_list = get_grade_distribution(selected_hr)

    else:
        hr_dict={}
        hr_json=""
        title="Not Authorized"
        grade_distribution_array=[]


    template_vars={
                'hr_dict': hr_dict,
                 'hr_json':hr_json,
                 'title': title,
                 'grade_distribution_array': json.dumps(grade_distribution_array),
                 'avg_grades' : json.dumps(avg_grades_list)
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
                                'assign_summary_dict' : assign_summary_df.to_dict(orient="index")} )

    else:
        return render(request, 'student/student_assignments.html',
                                {'student' : student} )




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
