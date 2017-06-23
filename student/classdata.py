import pandas
from django.db import connection
from student.ontrack import gpa_subjects_list, getPoints, getOnTrack
import gviz_api

def hr_data(hr, admin=False):
    #refactor, this should come from ontrack.get_gpa()
    if admin==True:
        hr_grades_sql= "SELECT grade,  MAX(grade_date) as recent_grade_date, display_name, \
        student_grade.student_id FROM  student_grade, student_subject, student_subjectinfo \
        WHERE student_subject.subject_name=student_grade.subject \
        AND student_subject.subject_name = student_subjectinfo.subject \
        GROUP BY  student_grade.subject, student_id"
    else:
        hr_grades_sql = "SELECT grade, MAX(grade_date) as recent_grade_date, display_name,  \
        student_roster.student_id FROM student_roster, student_grade, student_subject, student_subjectinfo \
        WHERE hr_id='%s' AND  \
        student_grade.student_id=student_roster.student_id AND  \
        student_subject.subject_name=student_grade.subject \
        AND student_subject.subject_name = student_subjectinfo.subject \
        GROUP BY student_roster.student_id, student_grade.subject"%(hr)

    hr_grades_df = pandas.read_sql(hr_grades_sql, con=connection)

    #remove duplicates
    #i need to add code to catch this earlier during grade updating, but for now, remove here
    hr_grades_df.drop_duplicates()

    hr_grades_wide=hr_grades_df.pivot_table(index='student_id', columns='display_name', values='grade')
    hr_grades_indexed = hr_grades_wide.reset_index()

    #calc GPA
    df_current_core_grades = hr_grades_df[hr_grades_df["display_name"].isin(gpa_subjects_list)]
    df_core_grades_indexed=df_current_core_grades.pivot(index='student_id', columns='display_name', values='grade')
    df_points=df_core_grades_indexed.applymap(getPoints)

    df_points['gpa']=df_points.mean(axis=1)
    df_points=df_points.reset_index()
    gpa_df=df_points[['student_id', 'gpa']]

    #get attendance
    #multiply days by 1.0 to coerce into float

    if admin==True:
        hr_attend_sql = "SELECT  total_days, absent_days, \
        ((total_days-absent_days)/ (total_days*1.0))*100  as attend_pct, \
        MAX(attend_date) as recent_attend_date, student_roster.student_id \
        from student_roster, student_attendance \
        WHERE  student_attendance.student_id = student_roster.student_id \
        GROUP BY student_roster.student_id"

    else:
        hr_attend_sql = "SELECT  total_days, absent_days, \
        ((total_days-absent_days)/ (total_days*1.0))*100  as attend_pct, \
        MAX(attend_date) as recent_attend_date, student_roster.student_id \
        from student_roster, student_attendance \
        WHERE hr_id='%s' AND student_attendance.student_id = student_roster.student_id \
        GROUP BY student_roster.student_id"%(hr)


    hr_attend_df = pandas.read_sql(hr_attend_sql, con=connection)
    hr_attend_df = hr_attend_df[["student_id", "attend_pct"]]

    #get names and homeroom
    if admin==True:
        hr_name_sql = "SELECT  first_name, last_name, student_roster.student_id, hr_id, current_student \
        from student_roster, student_student \
        WHERE student_student.student_id = student_roster.student_id "

    else:
        hr_name_sql = "SELECT  first_name, last_name, student_roster.student_id, hr_id, current_student \
        from student_roster, student_student \
        WHERE hr_id='%s' AND student_student.student_id = student_roster.student_id "%(hr)

    hr_name_df= pandas.read_sql(hr_name_sql, con=connection)


    #merge them all together (but maybe refactor to just send as separate dictionaries?)
    hr_data=hr_attend_df.merge(hr_grades_indexed, on="student_id")
    hr_data=hr_data.merge(gpa_df, on="student_id")
    hr_data=hr_data.merge(hr_name_df, on="student_id")

    #calc ontrack
    hr_data["onTrack"] = hr_data.apply(lambda hr_data: getOnTrack(hr_data["attend_pct"], hr_data["gpa"]), axis=1)

    #round gpa and Attendance
    hr_data.attend_pct = hr_data.attend_pct.round()
    hr_data.gpa = hr_data.gpa.round(2)

    #sort by ontrack
    hr_data=hr_data.sort_values(by='onTrack').reset_index()

    #only show for current students, then drop current_student column
    hr_data=hr_data[hr_data.current_student==True]
    hr_data.drop('current_student', axis=1, inplace=True)

    #get dictionary
    hr_dict=hr_data.to_dict('index')

    #values for google table
    hr_values=hr_data[['hr_id', 'onTrack', 'first_name', 'last_name','attend_pct', 'gpa', 'student_id']].values

    #set up Google Table to pass to View
    hr_desc=[("hr_id", "string", "HR" ),
              ("onTrack", "string", "On Track"),
             ("first_name", "string", "First Name"),
             ("last_name", "string", "Last Name"),
             ("attend_pct", "number", "Attend"),
             ("gpa", "number", "GPA"),
             ("student_id", "string", "ID")]
    hr_data_table=gviz_api.DataTable(hr_desc)
    hr_data_table.LoadData(hr_values)
    hr_json=hr_data_table.ToJSon()
    hr_json

    return(hr_json, hr_dict)
