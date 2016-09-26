from django.shortcuts import render, redirect
from student.models import Grade, Student, Attendance, Email, Subject
from allauth.socialaccount.models import SocialAccount
from django.db import connection
import pandas
import math

#for plotting
import gviz_api
from django.shortcuts import render
from django.db import connection

def get_user_id(da_request):
    social_email=SocialAccount.objects.get(user=da_request.user).extra_data['email']
    try:
        lookup_user_id=Email.objects.get(email=social_email).student_id
    except Email.DoesNotExist:
        lookup_user_id = "1"
    return lookup_user_id

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

    students=Student.objects.all()
    template_vars={'all_students': students}
    return render(request, "student/homeroom.html", template_vars)

def show_student(request):
        student_id = get_user_id(request)
        student=Student.objects.get(student_id= "%s"%(student_id))
        def getPoints(x):
        # if no grade for that subject at that date
            if math.isnan(x):
                # just return it untouched
                return x
            # but, if not, return the points
            elif x:
                if x>=90:
                    return 4
                elif x>=80:
                    return 3
                elif x>=70:
                    return 2
                elif x>=60:
                    return 1
                else:
                    return 0
            # and leave everything else
            else:
                return

        all_grades_sql = "SELECT grade, grade_date, display_name  FROM student_grade, student_subject  \
                   WHERE student_grade.student_id = '%s' \
                    AND student_grade.subject_id=student_subject.subject_id\
                    ORDER BY date(grade_date) DESC" %(student_id)

        df_all_grades = pandas.read_sql(all_grades_sql, con=connection)

        # disconnect from server
        connection.close()


        df_grades_indexed=df_all_grades.pivot(index='grade_date', columns='display_name', values='grade')
        df_points=df_grades_indexed.applymap(getPoints)
        df_points['gpa']=df_points.mean(axis=1)
        df_points=df_points.reset_index()
        gpa_values=df_points[['grade_date', 'gpa']].values

        #set up Google Table to pass to View
        gpa_desc=[("grade_date", "date", "Date" ),
                  ("gpa", "number", "GPA")]
        gpa_data_table=gviz_api.DataTable(gpa_desc)
        gpa_data_table.LoadData(gpa_values)
        gpa_json=gpa_data_table.ToJSon()

        #will be the GPA of the most recently entered grades
        #maybe change this to be the 4 most recent grades per subject!
        gpa=df_points.sort_values('grade_date',0,False)['gpa'].iloc[0]
        gpa='{:.2f}'.format(float(gpa))

        #Attendance
        attend_pct=round(Attendance.objects.filter(student_id="%s"%(student_id)).order_by('-attend_date')[0].calc_pct())
        attend_pct='{0:g}'.format(float(attend_pct))

        template_vars = {'current_gpa': gpa,
                         'current_student' : student ,
                         'gpa_json_data' : gpa_json,
                         'attendance_pct' : "100"}
        return render(request, 'student/student.html',template_vars )






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
        current_grades_sql= "SELECT grade, MAX(grade_date) as most_recent_grade_date, display_name, image \
                  FROM student_grade, student_subject \
                  WHERE student_id = '%s' AND student_grade.subject_id = student_subject.subject_id \
                  GROUP BY student_grade.subject_id ORDER BY student_subject.subject_id"%(student_id)

        #load into pandas dataframe,
        #should be refactored to do without this step (can use .values on a query set not sure about SQL)
        df_current_grades = pandas.read_sql(current_grades_sql, con=connection)

        #put into dictionary to use in templates
        current_grades_dict=df_current_grades.set_index('display_name').to_dict('index')

        # disconnect from server
        connection.close()

        #historical grades
        all_grades_sql = "SELECT grade, grade_date, display_name  FROM student_grade, student_subject  \
               WHERE student_grade.student_id = '%s' AND student_grade.subject_id=student_subject.subject_id" %(student_id )
        df_all_grades = pandas.read_sql(all_grades_sql, con=connection)
        df_grades_indexed=df_all_grades.pivot(index='grade_date', columns='display_name', values='grade')



        subject_names=list(df_grades_indexed.columns.values)
        df_grades_indexed.insert(0,'date', df_grades_indexed.index)
        all_grades_data=df_grades_indexed.values
        all_grades_data

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


        #GPA
        def getPoints(x):
        # if no grade for that subject at that date
            if math.isnan(x):
                # just return it untouched
                return x
            # but, if not, return the points
            elif x:
                if x>=90:
                    return 4
                elif x>=80:
                    return 3
                elif x>=70:
                    return 2
                elif x>=60:
                    return 1
                else:
                    return 0
            # and leave everything else
            else:
                return

        df_grades_indexed2=df_all_grades.pivot(index='grade_date', columns='display_name', values='grade')
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


        template_vars = {'current_grades_dict': current_grades_dict,
                         'current_student' : student ,
                         'all_grades_json' : historical_grades_json,
                         'gpa_json_data' : gpa_json,
                         'fake_cum_grade' : "99"}
        return render(request, 'student/student_grades.html',template_vars )




def show_student_attendance(request):

        student_id = get_user_id(request)
        student=Student.objects.get(student_id= "%s"%(student_id))
        attend_pct=round(Attendance.objects.filter(student_id="%s"%(student_id)).order_by('-attend_date')[0].calc_pct())
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
                        'attend_json_data': attend_json}

        return render(request, "student/student_attendance.html", template_vars)
