import sys
import pandas
from datetime import datetime
from student.models import STMathRecord
from student.helper_functions import df_from_query
from django.db import connection
import numpy as np
import gviz_api
import json

def get_all_jiji_json(student_group):
    if student_group == "all":
        current_stmath_sql="SELECT first_name, last_name, hr_id, gcd, k_5_progress, curr_hurdle, total_time, curr_objective, MAX(metric_date) as recent_date \
                  FROM student_roster, student_stmathrecord, student_student \
                  WHERE student_stmathrecord.student_id=student_roster.student_id AND\
                  student_roster.student_id=student_student.student_id\
                  GROUP BY  student_roster.student_id\
                  ORDER BY k_5_progress"
        params = None
        all_stmath_desc=[("first_name", "string", "First Name"),
                    ("last_name", "string", "Last Name"),
                     ("hr_id", "string", "HR"),
                    ("gcd", "string", "Level"),
                   ("k_5_progress", "number", "Syllabus Progress"),
                   ("curr_hurdle", "number", "Current Hurdle Tries"),
                    ("total_time", "number", "Total Time"),
                   ("cur_objective", "string", "Current Objective"),
                      ("recent_date", "string", "Data As Of")]
    else:
        current_stmath_sql="SELECT first_name, last_name, gcd, k_5_progress, curr_hurdle, total_time, curr_objective, MAX(metric_date) as recent_date \
                  FROM student_roster, student_stmathrecord, student_student \
                  WHERE student_stmathrecord.student_id=student_roster.student_id AND\
                  student_roster.student_id=student_student.student_id AND\
                  student_roster.hr_id=%s\
                  GROUP BY  student_roster.student_id\
                  ORDER BY k_5_progress"
        params = [student_group]
        all_stmath_desc=[("first_name", "string", "First Name"),
                      ("last_name", "string", "Last Name"),
                      ("gcd", "string", "Level"),
                     ("k_5_progress", "number", "Syllabus Progress"),
                     ("curr_hurdle", "number", "Current Hurdle Tries"),
                      ("total_time", "number", "Total Time"),
                     ("cur_objective", "string", "Current Objective"),
                        ("recent_date", "string", "Data As Of")]
    
    df_stmath_all = df_from_query(current_stmath_sql, params, connection=connection)
    if len(df_stmath_all) > 0:
        df_stmath_all['k_5_progress'] = df_stmath_all['k_5_progress'].astype('float') 
        all_stmath_values=df_stmath_all.values

        all_stmath_gviz_data_table=gviz_api.DataTable(all_stmath_desc)
        all_stmath_gviz_data_table.LoadData(all_stmath_values)
        all_stmath_gviz_json=all_stmath_gviz_data_table.ToJSon()
    #if there is no data in df_stmath_all
    else:
        all_stmath_gviz_json={}
    return(all_stmath_gviz_json)






def get_last_two_jiji(student_group):

    if student_group == "all":
        #last two ST math dates for stacked bar graph
        last_two_stmath_sql="SELECT  first_name || ' ' || last_name || ' '||student_student.student_id  AS full_name, gcd, k_5_progress, metric_date\
                  FROM student_roster, student_stmathrecord, student_student \
                  WHERE student_stmathrecord.student_id=student_roster.student_id AND\
                  student_roster.student_id=student_student.student_id AND\
                  metric_date IN (SELECT  metric_date\
                 FROM student_stmathrecord\
                 GROUP BY metric_date\
                 ORDER BY metric_date DESC\
                 LIMIT 2)\
                  ORDER BY -metric_date"
        params = None

    else:
        last_two_stmath_sql="SELECT  first_name || ' ' || last_name AS full_name, gcd, k_5_progress, metric_date\
                  FROM student_roster, student_stmathrecord, student_student \
                  WHERE student_stmathrecord.student_id=student_roster.student_id AND\
                  student_roster.student_id=student_student.student_id AND\
                  student_roster.hr_id=%s AND\
                  metric_date IN (SELECT  metric_date\
                 FROM student_stmathrecord\
                 GROUP BY metric_date\
                 ORDER BY metric_date DESC\
                 LIMIT 2)\
                  ORDER BY -metric_date"
        params = [student_group]

    df_stmath_two_dates = df_from_query(last_two_stmath_sql, params, connection=connection)

    if len(df_stmath_two_dates) > 0:
        df_stmath_two_dates = df_stmath_two_dates.pivot(index="full_name", columns="metric_date", values="k_5_progress").reset_index()
        df_stmath_two_dates['total_progress'] =  df_stmath_two_dates.ix[:,2]
        df_stmath_two_dates = df_stmath_two_dates.sort_values(['total_progress'] , ascending=[False])

        df_stmath_two_dates['prev_progress'] =  df_stmath_two_dates.ix[:,1]
        df_stmath_two_dates['recent_progress'] =  df_stmath_two_dates['total_progress'] - df_stmath_two_dates['prev_progress']
        df_stmath_two_dates = df_stmath_two_dates[['full_name', 'prev_progress', 'recent_progress']]
        #break into the names of each column (the dates) and the values in order to feed into Gviz' DataTable

        #first get the names of each column, convert them to strings and add them to a new array
        col_names=list(df_stmath_two_dates)

        # type convert decimal values to floats, for json encoder
        # TODO: consider just making the JSON encoder smarter 
        df_stmath_two_dates['prev_progress'] = df_stmath_two_dates['prev_progress'].astype('float')
        df_stmath_two_dates['recent_progress'] = df_stmath_two_dates['recent_progress'].astype('float')

        #get the values of the data frame (the progress each student had made)
        stmath_two_dates_values=df_stmath_two_dates.values

        #join these two arrays together
        last_two_stdates_data=np.vstack((col_names,stmath_two_dates_values))

        last_two_stdates_data_list=last_two_stdates_data.tolist()



        last_two_stdates_data_json = json.dumps(last_two_stdates_data_list)
    else:
        last_two_stdates_data_json = ""

    return(last_two_stdates_data_json)
