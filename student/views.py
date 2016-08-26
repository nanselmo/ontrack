from django.shortcuts import render
from student.models import Grade, Student
from django.db import connection
import pandas

#for plotting
import gviz_api
from django.shortcuts import render
from bokeh.plotting import figure
from bokeh.resources import CDN
from bokeh.embed import components
from bokeh.charts import Scatter, TimeSeries
from bokeh.plotting import figure
from bokeh.models import TapTool, HoverTool, ColumnDataSource, DatetimeTickFormatter
from collections import OrderedDict
import numpy as np
from bokeh.palettes import Spectral11

#bokeh
from django.db import connection

# Create your views here.

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

def show_student(request, student_id):

    student=Student.objects.filter(student_id= "%s"%(student_id))


    # Prepare SQL for current grades
    #table names in django are appname_modelname

    current_grades_sql= "SELECT grade, MAX(grade_date) as most_recent_grade_date, subject_name, image \
              FROM student_grade, student_subject \
              WHERE student_id = '%s' AND student_grade.subject_id = student_subject.subject_id \
              GROUP BY student_grade.subject_id"%(student_id)

    #load into pandas dataframe,
    #should be refactored to do without this step (can use .values on a query set not sure about SQL)
    df_current_grades = pandas.read_sql(current_grades_sql, con=connection)

    #put into dictionary to use in templates
    current_grades_dict=df_current_grades.set_index('subject_name').to_dict('index')

    # disconnect from server
    connection.close()

    #SQL to dictionary for all grades
    all_grades_sql = "SELECT grade, grade_date, subject_name  FROM student_grade, student_subject  \
           WHERE student_grade.student_id = '%s' AND student_grade.subject_id=student_subject.subject_id" %(student_id )
    df_all_grades = pandas.read_sql(all_grades_sql, con=connection)
    df_grades_indexed=df_all_grades.pivot(index='grade_date', columns='subject_name', values='grade')


    subject_names=list(df_grades_indexed.columns.values)
    df_grades_indexed.insert(0,'date', df_grades_indexed.index)
    all_grades_data=df_grades_indexed.values
    all_grades_data

    grades_desc =[]
    grades_desc.append(("grade_date", "date", "Date" ))
    for index,subject in enumerate(subject_names):
        grades_desc.append( ("subj"+str(index+1), "number", subject))

    # Loading it into gviz_api.DataTable
    all_grades_data_table = gviz_api.DataTable(grades_desc)
    all_grades_data_table.LoadData(all_grades_data)
    historical_grades_json = all_grades_data_table.ToJSon()
    historical_grades_json


    template_vars = {'current_grades_dict': current_grades_dict,
                     'current_student' : student ,
                     'all_grades_json' : historical_grades_json}
    return render(request, 'student/show_student.html',template_vars )
