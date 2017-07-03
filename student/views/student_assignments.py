from django.shortcuts import render 
from student.models import (Student, SubjectInfo, STMathRecord)
from student.helper_functions import df_from_query
from student.assignmentimpact import get_assign_impact
import gviz_api

def student_assignments(request, student_id=1, display_subject="Math"):
    
    student = Student.objects.get(student_id=str(student_id))
    long_subject = SubjectInfo.objects.get(display_name=display_subject).subject
    subject_name = long_subject.subject_name

    if display_subject == "Math":
        stmath_sql = "Select metric_date, k_5_progress \
           FROM student_stmathrecord WHERE student_id = %s"
        params = [student_id]
        df_stmath = df_from_query(stmath_sql, params) 

        if len(df_stmath)> 0:
            curJiJi = STMathRecord.objects.filter(student=student_id).order_by('-metric_date')[0].k_5_progress
            #get the values from the df and define the columns of the datatable
            # TODO: consider changing the DB schema or JSON encoder to avoid this
            df_stmath["k_5_progress"] = df_stmath["k_5_progress"].astype('float')
            stmath_values = df_stmath.values
            description = [
                ("metric_date", "date", "Date"),
                ("k_5_progress", "number", "Syllabus Progress")
            ]
            # Loading it into gviz_api.DataTable and covert to JSON
            st_math_data_table = gviz_api.DataTable(description)
            st_math_data_table.LoadData(stmath_values)
            #stmath_values
            st_math_gviz_json = st_math_data_table.ToJSon()

        else:
            st_math_gviz_json = {}
            #JiJi summary, move this to a method
            curJiJi = []

    else:
        st_math_gviz_json = {}
        curJiJi = []

    if get_assign_impact(student_id, subject_name) != "No assignments":
        assign_clean_df, assign_summary_df = get_assign_impact(student_id, long_subject)
        #set up gviz
        summary_values = assign_summary_df.values
        summary_desc = [
            ("Category", "string", "Category"),
            ("Weight", "string", "Weight"),
            ("NumGrades", "string", "Total Assignments"),
            ("Points", "number", "Points Earned"),
            ("PointsPossible", "number", "Points Possible"),
            ("Pct", "number", "Percent of Points"),
            ("TotImpact", "number", "Impact")
        ]
        summary_gviz_data_table = gviz_api.DataTable(summary_desc)
        summary_gviz_data_table.LoadData(summary_values)
        summary_gviz_json = summary_gviz_data_table.ToJSon()

        assign_values = assign_clean_df.values
        assign_desc =[
            ("Assignment", "string", "Assignment"),
            ("Score", "number", "Score"),
            ("ScorePossible", "number", "Possible Score"),
            ("Pct", "number", "Percent"),
            ("Category", "string", "Category"),
            ("Impact", "number", "Impact")
        ]
        assign_gviz_data_table = gviz_api.DataTable(assign_desc)
        assign_gviz_data_table.LoadData(assign_values)
        assign_gviz_json = assign_gviz_data_table.ToJSon()

        return render(
            request,
            'student/student_assignments.html',
            {
                'student': student,
                'assign_gviz_json': assign_gviz_json,
                'summary_gviz_json': summary_gviz_json,
                'assign_list_dict': assign_clean_df.to_dict(orient="index"),
                'assign_summary_dict': assign_summary_df.to_dict(orient="index"),
                'stmath_gviz_json': st_math_gviz_json,
                'curJiJi': curJiJi
            }
        )

    # If get_assign_impact returns no assignments
    else:
        return render(request, 'student/student_assignments.html',
                 {'student': student, 'stmath_gviz_json': st_math_gviz_json} )


