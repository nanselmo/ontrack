from django.shortcuts import render, redirect
from student.models import Grade, Student, Attendance, Email, Subject
from allauth.socialaccount.models import SocialAccount
from django.db import connection
from ontrack import get_user_id, getOnTrack, getPoints, gpa_subjects_list, get_gpa, get_attend_pct, get_test_score, take_out_subjects_list
#from grade_audit import *
import pandas
import math
from django.http import HttpResponseRedirect
from forms import UploadFileForm

#for plotting
import gviz_api
from django.shortcuts import render
from django.db import connection

#debug
#import pdb;

# def upload_grade_files(request):
#     if request.method == 'POST':
#         form = UploadFileForm(request.POST, request.FILES)
#         if form.is_valid():
#             uploaded_file = request.FILES['html-file-attribute-name']
#             # Write the file to disk
#             fout = open("on-track/student-data/%s" % uploaded_file.name, 'wb')
#             for chunk in uploaded_file.chunks():
#                 fout.write(chunk)
#             fout.close()
#             return HttpResponseRedirect('/grade_report/')
#     else:
#         form = UploadFileForm()
#     return render(request, 'student/uploadGradeFiles.html', {'form': form})
#
# def grade_report(request):
#     template_vars=summarize_data("admin")
#     return render(request, "student/ind-teacher-report.html", template_vars)

def google_chart(request):

    #use pandas to turn sql into dataframe and then a matrix (list of lists)
    attend_sql="Select attend_date, absent_days \
    FROM student_attendance WHERE student_id=1"
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

    return render(request, "google_chart.html", {'attend_json_data': attend_json})


def google_table(request):

    attend_sql="Select attend_date, absent_days, total_days \
    FROM student_attendance WHERE student_id=1"
    df_attend = pandas.read_sql(attend_sql, con=connection)
    attend_dict=df_attend.to_dict(orient="records")
    description = {"absent_days": ("number", "Absences"),
                 "attend_date": ("date", "Date"),
                 "total_days": ("number", "Total Days")}


    # Loading it into gviz_api.DataTable
    data_table = gviz_api.DataTable(description)
    data_table.LoadData(attend_dict)


    # Create a JavaScript code string.
    jscode = data_table.ToJSCode("jscode_data",
                               columns_order=("attend_date", "absent_days", "total_days"),
                               order_by="attend_date")
    # Create a JSON string.
    json = data_table.ToJSon(columns_order=("attend_date", "absent_days", "total_days"),
    order_by="attend_date")
    return render(request, "google_chart.html", {'json': json, 'jscode':jscode})


def simple_chart(request):
    #SQL to dictionary
    grades_sql = "SELECT grade, grade_date, subject_id  FROM student_grade  \
           WHERE student_id = '%s' AND subject_id = '%s'" %('50155809', '4')
    df_grades = pandas.read_sql(grades_sql, con=connection)
    grades_dict = OrderedDict({'grade_date': df_grades.grade_date})
    grades_dict['grade'] = df_grades.grade

    #create Bokeh plot
    source = ColumnDataSource(data=grades_dict)
    TOOLS = ['hover', 'pan', 'tap']
    plot = figure(x_axis_type='datetime', plot_height=250, tools=TOOLS)
    plot.line('grade_date', 'grade', line_width=5, source=source)

    #turn Bokeh plot into javascript and html div
    script, div = components(plot, CDN)


    return render(request, "simple_chart.html", {"the_script": script, "the_div": div})
def show_home(request):
    try:
        if request.user.is_authenticated:
            social_email = SocialAccount.objects.get(user=request.user).extra_data['email']

        else:
            social_email= "none"
        math = Subject.objects.get(subject_id=12)
        return render(request, "student/home.html", {'social_email': social_email,  "math" : math})

    except SocialAccount.DoesNotExist:
        return render(request, 'student/no-match-found.html')



def show_dashboard(request):
    lookup_user_id=get_user_id(request)


    return render(request, "student/dashboard.html", {'user_email': lookup_user_id})

def show_hr(request):

    hr = "B314"
    hr_grades_sql = "SELECT grade, MAX(grade_date) as recent_grade_date, subject, \
    student_roster.student_id from student_roster, student_grade \
    WHERE hr_id='%s' AND  \
    student_grade.student_id=student_roster.student_id  \
    GROUP BY student_roster.student_id, student_grade.subject_id"%(hr)

    hr_grades_df = pandas.read_sql(hr_grades_sql, con=connection)
    hr_grades_wide=hr_grades_df.pivot(index='student_id', columns='subject', values='grade')
    hr_grades_indexed = hr_grades_wide.reset_index()

    #calc GPA
    df_current_core_grades = hr_grades_df[hr_grades_df["subject"].isin(gpa_subjects_list)]
    df_core_grades_indexed=df_current_core_grades.pivot(index='student_id', columns='subject', values='grade')
    df_points=df_core_grades_indexed.applymap(getPoints)
    df_points['gpa']=df_points.mean(axis=1)
    df_points=df_points.reset_index()
    gpa_df=df_points[['student_id', 'gpa']]

    #get attendance
    hr_attend_sql = "SELECT  ((total_days-absent_days)/total_days) *100 as attend_pct, \
    MAX(attend_date) as recent_attend_date, student_roster.student_id \
    from student_roster, student_attendance \
    WHERE hr_id='%s' AND student_attendance.student_id = student_roster.student_id \
    GROUP BY student_roster.student_id"%(hr)

    hr_attend_df = pandas.read_sql(hr_attend_sql, con=connection)
    hr_attend_df = hr_attend_df[["student_id", "attend_pct"]]

    #merge them all together (but maybe refactor to just send as separate dictionaries?)
    hr_data=hr_attend_df.merge(hr_grades_indexed, on="student_id")
    hr_data=hr_data.merge(gpa_df, on="student_id")

    #calc ontrack
    hr_data["onTrack"] = hr_data.apply(lambda hr_data: getOnTrack(hr_data["attend_pct"], hr_data["gpa"]), axis=1)

    #get dictionary
    hr_dict=hr_data.to_dict('index')

    template_vars={'hr_dict': hr_dict}
    return render(request, "student/homeroom.html", template_vars)

def show_student(request, student_id="1"):

        this_student_id = get_user_id(request, student_id)
        student=Student.objects.get(student_id= "%s"%(this_student_id))


        #get gpa for get_gpa method (in ontrack.py)
        student_gpa=get_gpa(this_student_id)
        gpa=student_gpa['gpa']

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
                         'ontrack' : onTrack}
        return render(request, 'student/student.html',template_vars )


def show_hs_options(request, ):
    student_id = get_user_id(request)
    student=Student.objects.get(student_id= "%s"%(student_id))

    #hardcode tier for now
    tier=3

    student=Student.objects.get(student_id= "%s"%(student_id))
    current_grades=get_gpa(student_id)['current_dict']
    nwea_scores=get_test_score(student_id , "NWEA")
    nwea_math=nwea_scores['math_pct']
    nwea_reading=nwea_scores['read_pct']


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
        for subject in grade_dict:
            if subject !="grade_date":
                tot_ib=tot_ib+get_points(grade_dict[subject])['ib']
                tot_ses=tot_ses+get_points(grade_dict[subject])['ses']

        #total points are the points awarded by letter grade plus a factor times the NWEA percentiles
        tot_ib=tot_ib+2.2727*(int(nwea_scores['math_pct']) + int(nwea_scores['read_pct']))
        tot_ses=tot_ses+1.515*(int(nwea_scores['math_pct']) + int(nwea_scores['read_pct']))
        return({'ib_totl': tot_ib, 'ses_totl': tot_ses })

    points=total_hs_points(current_grades, nwea_scores)

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


        #subtract the total they need from what they have
        if row['school_type']=="IB":
            student_pts=admit_pts-points['ib_totl']
        elif row['school_type']=="SES":
            student_pts=admit_pts-points['ses_totl']
        if student_pts<0:
            student_pts="Eligible"
        return(student_pts)


    hs_df['RemainingPts'] = hs_df.apply(lambda row: getAppPts(row), axis=1)
    hs_df=hs_df.sort_values('RemainingPts')
    hs_df.index = range(1,len(hs_df) + 1)
    student_hs_dict=hs_df.to_dict(orient='index')





    template_vars={'current_student': student, 'hs_dict':student_hs_dict, 'ses_points': points["ses_totl"], 'ib_points': points["ib_totl"]}
    return render(request, "student/student_hs.html", template_vars)




def show_student_ontrack(request):
        student_id = get_user_id(request)
        student=Student.objects.get(student_id= "%s"%(student_id))
        template_vars={'current_student': student}
        return render(request, "student/student_ontrack.html", template_vars)




def show_student_calc(request):
        student_id = get_user_id(request)
        student=Student.objects.get(student_id= "%s"%(student_id))
        template_vars={'current_student': student}
        return render(request, "student/student_calc.html", template_vars)



def show_student_grades(request):

        student_id = get_user_id(request)
        student=Student.objects.get(student_id= "%s"%(student_id))
        #image
        current_grades_sql= "SELECT grade, MAX(grade_date) as most_recent_grade_date, subject, display_name, image \
                  FROM student_grade, student_subject \
                  WHERE student_id = '%s' AND student_subject.subject_name=student_grade.subject  \
                  GROUP BY student_grade.subject"%(student_id)

        #load into pandas dataframe,
        #should be refactored to do without this step (can use .values on a query set not sure about SQL)
        df_current_grades = pandas.read_sql(current_grades_sql, con=connection)

        df_current_core_grades = df_current_grades[df_current_grades["display_name"].isin(gpa_subjects_list)]


        #put into dictionary to use in student_grades.html template
        current_core_grades_dict=df_current_core_grades.set_index('display_name').to_dict('index')

        # disconnect from server
        connection.close()

        #historical grades for Google Viz
        all_grades_sql = "SELECT grade, grade_date, subject, MAX(created), display_name  FROM student_grade, student_subject  \
           WHERE student_grade.student_id = '%s' AND student_subject.subject_name=student_grade.subject \
           GROUP BY student_grade.grade_date, subject" %(student_id )
        df_all_grades = pandas.read_sql(all_grades_sql, con=connection)


        #only include core grades
        df_current_core_grades = df_all_grades[df_all_grades["display_name"].isin(gpa_subjects_list)]
        df_all_grades=df_current_core_grades
        df_grades_indexed=df_all_grades.pivot(index='grade_date', columns='display_name', values='grade')



        subject_names=list(df_grades_indexed.columns.values)
        df_grades_indexed.insert(0,'date', df_grades_indexed.index)
        all_grades_data=df_grades_indexed.values


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



        df_grades_indexed2=df_current_core_grades.pivot(index='grade_date', columns='display_name', values='grade')

        df_points=df_grades_indexed2.applymap(getPoints)
        df_points['gpa']=df_points.mean(axis=1)
        df_points=df_points.reset_index()
        gpa_values=df_points[['grade_date', 'gpa']].values

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
                         'fake_cum_grade' : "99"}
        return render(request, 'student/student_grades.html',template_vars )




def show_student_attendance(request):

        student_id = get_user_id(request)
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
                        'attend_data': attend_data}

        return render(request, "student/student_attendance.html", template_vars)
