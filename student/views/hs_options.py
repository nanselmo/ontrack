import json
from django.shortcuts import render
from student.models import (Student, Roster, NWEAPercentileConversion)
from student.ontrack import (get_user_info, get_gpa, get_test_score)
from student.helper_functions import df_from_query

#FIXME: hardcoded
from student.hardcoded import default_nwea_season

def hs_options(request, student_id=1):

    _, user_type = get_user_info(request, student_id)
    student = Student.objects.get(student_id=str(student_id))

    #hardcode tier for now
    tier=2

    current_grades_df = get_gpa(student_id, "current", "student")['grades_df']
    current_grades_dict = current_grades_df.set_index('display_name').to_dict('index')

    nwea_scores=get_test_score(student_id , "NWEA")

    #still need to change this to default to an A for 8th grade SS
    def total_hs_points(grade_dict, nwea_score_dict):

        def get_points(num):
            ib_points=0
            ses_points=0
            if(num>=91):
                ses_points=75
                ib_points=112.5
            elif(num>=81):
                ses_points=50
                ib_points=75
            elif(num>=71):
                ses_points=25
                ib_points=38
            else:
                ses_points=0
                ib_points=0
            return({'ib': ib_points, 'ses':ses_points})

        #get the points for each letter grade
        tot_ib=0
        tot_ses=0
        for subject, info in grade_dict.items():
                tot_ib = tot_ib + get_points(info['grade'])['ib']
                tot_ses = tot_ses + get_points(info['grade'])['ses']

        #total points are the points awarded by letter grade plus a factor times the NWEA percentiles
        if nwea_score_dict['math_pct'] != "not available":
            tot_ib = tot_ib + 2.2727 * int(nwea_score_dict['math_pct'])
            tot_ses = tot_ses + 1.515 * int(nwea_score_dict['math_pct'])
        if nwea_score_dict['read_pct'] != "not available":
            tot_ib = tot_ib + 2.2727 * int(nwea_score_dict['read_pct'])
            tot_ses = tot_ses + 1.515 * int(nwea_score_dict['read_pct'])
        return({'ib_totl': tot_ib, 'ses_totl': tot_ses })

    points = total_hs_points(current_grades_dict, nwea_scores)

    hs_sql = "SELECT * from student_highschool"

    hs_df_raw = df_from_query(hs_sql)
    hs_df = hs_df_raw[hs_df_raw['tier1_points']>0]

    def getAppPts(row):
        admit_pts=0
        student_pts=0
        #get how many points that school needs for admission
        if tier == 1 or row['school_type']=="IB":
            admit_pts=row['tier1_points']
        elif tier == 2:
            admit_pts=row['tier2_points']
        elif tier == 3:
            admit_pts=row['tier3_points']
        elif tier == 4:
            admit_pts=row['tier4_points']

        #test score is out of 300, assume students get at least a 60% on it
        admit_pts = admit_pts-200

        #subtract the total they need from what they have
        if row['school_type'] == "IB":
            student_pts = admit_pts - points['ib_totl']
        elif row['school_type'] =="SES":
            student_pts = admit_pts - points['ses_totl']


        return(int(round(student_pts)))

    hs_df['RemainingPts'] = hs_df.apply(lambda row: getAppPts(row), axis=1)
    hs_df = hs_df.sort_values('RemainingPts', ascending=True)
    hs_df.index = range(1,len(hs_df) + 1)
    student_hs_dict = hs_df.to_dict(orient='index')

    #need to pass the RIT to Percentile Conversion for this student's grade Level
    stu_grade_level = Roster.objects.get(student_id=str(student_id)).grade_level
    def get_RIT_conversion(subject):

        conversion_QuerySet=NWEAPercentileConversion.objects.filter(
                                           subject = subject,
                                           grade_level = stu_grade_level,
                                           season = default_nwea_season).values('percentile', 'rit')
        conversion_json = json.dumps([dict(item) for item in conversion_QuerySet])
        return conversion_json

    m_conversion_json = get_RIT_conversion("Mathematics")
    r_conversion_json = get_RIT_conversion("Reading")

    template_vars={'current_student': student,
        'hs_dict':student_hs_dict,
        'ses_points': points["ses_totl"],
        'ib_points': points["ib_totl"],
        'student_id':student_id,
        'current_grades_dict': current_grades_dict,
        'nwea_math' : nwea_scores["math_score"],
        'nwea_reading' : nwea_scores["read_score"],
        'math_RIT_json' : m_conversion_json,
        'reading_RIT_json' : r_conversion_json}
    return render(request, "student/student_calc.html", template_vars)

