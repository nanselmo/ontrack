from django.shortcuts import render
from student.helper_functions import df_from_query

def nwea_summary(request, student_id=1, selected_hr="A308"):
    # FIXME: hardcoded
    nwea_session = "Winter 2016-2017"

    nwea_sql = "SELECT student_roster.student_id, first_name, last_name, percentile,\
        subject, test_session   \
        FROM student_roster, student_testscore, student_student\
        WHERE hr_id=%s \
            AND student_roster.student_id = student_testscore.student_id\
            AND student_roster.student_id = student_student.student_id\
            AND student_testscore.test_session = %s"

    params = [selected_hr, nwea_session] 
    nwea_df = df_from_query(nwea_sql, params)
    template_vars={'student_data': nwea_df,
                    'hr': selected_hr}

    return render(request, "student/nwea_summary.html", template_vars)
