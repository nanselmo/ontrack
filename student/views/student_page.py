from django.shortcuts import render
from student.ontrack import (get_user_info, get_gpa, get_attend_pct, getOnTrack)
from student.models import Student
import gviz_api
import sys

# TODO: create example student rather than pull
#   student 1 if not student passed
def student_page(request, student_id=1):
    student = Student.objects.get(student_id=student_id)

    #get gpa for get_gpa method (in ontrack.py)
    try:
        student_gpa = get_gpa(student_id, "current", "student")['gpa']
    except ValueError:
        print >>sys.stderr, "student_page: No GPA found"
        student_gpa = {'current_gpa':0.0, 'values': []}

    gpa = student_gpa['current_gpa']

    #set up Google Table to pass to View
    gpa_desc=[("grade_date", "date", "Date" ),
              ("gpa", "number", "GPA")]
    gpa_data_table=gviz_api.DataTable(gpa_desc)
    gpa_data_table.LoadData(student_gpa['values'])
    gpa_json=gpa_data_table.ToJSon()

    #Attendance
    attend_pct=get_attend_pct(student_id)
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

