from django.shortcuts import render
from student.models import Student
from student.ontrack import (get_gpa, get_user_info)
import gviz_api

def student_grades(request, student_id=1):

    student = Student.objects.get(student_id=str(student_id))

    current_core_grades_df = get_gpa(student_id, "current", "student")['grades_df']
    #put into dictionary to use in student_grades.html template
    current_core_grades_dict = current_core_grades_df.set_index('display_name').to_dict('index')

    historical_core_grades_df = get_gpa(student_id, "historical")['grades_df']
    subject_names = list(historical_core_grades_df.columns.values)
    historical_core_grades_df.insert(0,'date', historical_core_grades_df.index)
    all_grades_data = historical_core_grades_df.values

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

    gpa_values=get_gpa(student_id, "current")['gpa']['values']

    #set up Google Table to pass to View
    gpa_desc=[("grade_date", "date", "Date" ),
              ("gpa", "number", "GPA")]
    gpa_data_table = gviz_api.DataTable(gpa_desc)
    gpa_data_table.LoadData(gpa_values)
    gpa_json = gpa_data_table.ToJSon()

    template_vars = {'current_core_grades_dict': current_core_grades_dict,
                     'current_student' : student ,
                     'all_grades_json' : historical_grades_json,
                     'gpa_json_data' : gpa_json,
                     'fake_cum_grade' : "99",
                     'student_id': student_id}

    return render(request, 'student/student_grades.html',template_vars )

