from django.shortcuts import render
from student.models import (Attendance, Student)
from student.helper_functions import df_from_query
import gviz_api

def student_attendance(request, student_id=1):

    student = Student.objects.get(student_id=str(student_id))
    attend_data = Attendance.objects.filter(student_id=str(student_id)).order_by('-attend_date')[0]
    attend_pct = round(attend_data.calc_pct())

    attend_sql = "Select attend_date, absent_days \
        FROM student_attendance WHERE student_id=%s"
    params = [student_id]
    df_attend = df_from_query(attend_sql, params) 

    # type convert decimal to float
    # FIXME: consider changing either DB schema or JSON encoder rather than this
    df_attend['absent_days'] = df_attend['absent_days'].astype('float')
    attend_data_matrix=df_attend.as_matrix() #<--maybe just use values.tolist() here?
    #make Google Viz' DataTable schema to describe the columns
    description = [("attend_date", "date", "Date" ),
               ("absent_days", "number", "Absences")]
    # Load the schema and data
    attend_data_table = gviz_api.DataTable(description)
    attend_data_table.LoadData(attend_data_matrix)
    #turn into json to pass to the template
    attend_json = attend_data_table.ToJSon()

    template_vars = {
        'current_student': student,
        'current_attend_pct': attend_pct,
        'attend_json_data': attend_json,
        'attend_data': attend_data,
        'student_id':student_id
    }

    return render(request, "student/student_attendance.html", template_vars)

