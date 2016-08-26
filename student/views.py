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

    #create Bokeh plot
    numlines=len(df_grades_indexed.columns)
    mypalette=Spectral11[0:numlines]

    _tools_to_show = 'pan,save,hover,resize,reset,wheel_zoom'

    p5 = figure(width=500, height=300, x_axis_type="datetime", tools=_tools_to_show)
    p5.multi_line(xs=[df_grades_indexed.index.values]*numlines,
                    ys=[df_grades_indexed[subject].values for subject in df_grades_indexed],
                    line_color=mypalette,
                    line_width=5)

    # THEN put  scatter one at a time on top of each one to get tool tips (HACK! lines with tooltips not yet supported by Bokeh?)
    for (name, series) in df_grades_indexed.iteritems():
        # need to repmat the name to be same dimension as index
        name_for_display = np.tile(name, [len(df_grades_indexed.index),1])

        source = ColumnDataSource({'x': df_grades_indexed.index, 'y': series.values,
                                   'series_name': name_for_display, 'Date': df_grades_indexed.index.format()})

        p5.scatter('x', 'y', source = source, size=20, fill_alpha=0, line_alpha=0, line_color="grey")

        hover = p5.select(dict(type=HoverTool))
        hover.tooltips = [("Subject", "@series_name"), ("Date", "@Date"),  ("FinalAvg", "@y"),]
        hover.mode = 'mouse'

    #turn Bokeh plot into javascript and html div
    bokeh_script, bokeh_div = components(p5, CDN)


    #JUST FOR COMPARRISON/REFERENCE, ADD GOOGLE charts
    #all_grades_sql = "SELECT grade, grade_date, subject_name  FROM student_grade, student_subject  \
           #WHERE student_grade.student_id = '%s' AND student_grade.subject_id=student_subject.subject_id" %(student_id )

    #df_all_grades = pandas.read_sql(all_grades_sql, con=connection)
    #df_grades_indexed=df_all_grades.pivot(index='grade_date', columns='subject_name', values='grade')

    subject_names=list(df_grades_indexed.columns.values)
    df_grades_indexed.insert(0,'date', df_grades_indexed.index)
    all_grades_data=df_grades_indexed.values
    all_grades_data

    # I need to  make this dynamic with a loop!!!
    #for index,subject in enumerate(subject_names):
    #print 'subj'+str(index+1), ', number, ', subject
    grades_description = [("grade_date", "date", "Date" ),
                   ("subj1", "number", subject_names[0] ),
                   ("subj2", "number", subject_names[1] ),
                   ("subj3", "number", subject_names[2]),
                   ("subj4", "number", subject_names[3] )]

    # Loading it into gviz_api.DataTable
    all_grades_data_table = gviz_api.DataTable(grades_description)
    all_grades_data_table.LoadData(all_grades_data)
    historical_grades_json = all_grades_data_table.ToJSon()
    historical_grades_json



    subject_logo = "http://www.freeiconspng.com/uploads/geometry-icon-31.png"


    template_vars = {'current_grades_dict': current_grades_dict,
                     'bokeh_chart_script': bokeh_script,
                     'bokeh_chart_div' : bokeh_div,
                     'current_student' : student ,
                     'subject_logo' : subject_logo,
                     'all_grades_json' : historical_grades_json}
    return render(request, 'student/show_student.html',template_vars )
