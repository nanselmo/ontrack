from django.shortcuts import render
import pandas
from student.loadOnTrackData import get_df    
import gviz_api

def teacher_attendance(request):

    message = "Employee Attendance"

    staff_attend_file = "ontrack/student-data/teacher-attendance.csv"
    df, file_date = get_df(staff_attend_file, False)

    #make sure date column is a date
    df['Date'] = pandas.to_datetime(df['Date'])

    #drop null values (at end of file)
    df = df.dropna()

    #get the values from the df and define the columns of the datatable
    df_values = df.values
    description = [("Date", "date", "Date"),
        ("Absences", "number", "Absences")]

    # Loading it into gviz_api.DataTable and covert to JSON
    teacher_attend_data_table = gviz_api.DataTable(description)
    teacher_attend_data_table.LoadData(df_values)

    #convert to json
    attend_gviz_json = teacher_attend_data_table.ToJSon()

    template_vars = {"msg": message, "attend_gviz_json": attend_gviz_json}

    return render(request, "student/teacher_attendance.html", template_vars)
