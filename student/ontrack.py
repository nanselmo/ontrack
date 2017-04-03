from student.models import  Email, Attendance, TestScore
from allauth.socialaccount.models import SocialAccount
from django.db import connection
import math

#sql to pandas
import pandas
from django.db import connection


#variables
gpa_subjects_list = ['Math', 'Science', 'Social Studies', 'Reading' ]
take_out_subjects_list=['Speaking', 'Listening']
#gpa_subjects_list=['CHGO READING FRMWK','MATHEMATICS STD','SCIENCE  STANDARDS','SOCIAL SCIENCE STD']

#functions

def get_user_info(the_request, student_id=1):
    social_email = SocialAccount.objects.get(user=the_request.user).extra_data['email']
    try:
        user_type=Email.objects.get(email=social_email).user_type
    except:
        user_type = "Student"
    #admin and teacher can look at any user's info
    if user_type in ["School Admin", "Teacher"]:
        student_id=student_id
    #if they're a student, try matching their email to a user
    else:
        try:
            student_id=Email.objects.get(email=social_email).student_id
        #if they don't match a know student email, default them to student 1
        except:
            student_id = 1
    return(student_id, user_type)





def getOnTrack(att, gpa):
    if gpa>=3:
        if att>=95:
            onTrack=5
        elif att>=90:
            onTrack=4
        else:
            onTrack=3
    elif gpa>=2:
        if att>=98:
            onTrack=4
        elif att>=90:
            onTrack=3
        else:
            onTrack=2
    elif gpa>=1:
        if att>=98:
            onTrack=3
        elif att>=80:
            onTrack=2
        else:
            onTrack=1
    else:
        if att>=90:
            onTrack=2
        else:
            onTrack=1
    return onTrack



def getPoints(x):
# if no grade for that subject at that date
    if math.isnan(x):
        # just return it untouched
        return x
    # but, if not, return the points
    elif x:
        if x>=90:
            return 4
        elif x>=80:
            return 3
        elif x>=70:
            return 2
        elif x>=60:
            return 1
        else:
            return 0
    # and leave everything else
    else:
        return

def get_attend_pct(student_id):
    pct=round(Attendance.objects.filter(student_id="%s"%(student_id)).order_by('-attend_date')[0].calc_pct())
    return(pct)

def get_gpa(student_id):
    all_grades_sql = "SELECT grade, grade_date, subject, MAX(created),  display_name \
               FROM student_grade, student_subject  \
               WHERE student_grade.student_id = '%s' AND \
                student_grade.subject=student_subject.subject_name  \
               GROUP BY student_grade.grade_date, subject \
               ORDER BY date(grade_date) DESC" %(student_id)


    current_grades_sql="SELECT grade, MAX(grade_date) as most_recent_grade_date, subject, display_name, image \
                      FROM student_grade, student_subject \
                      WHERE student_id = '%s' AND student_subject.subject_name=student_grade.subject  \
                      GROUP BY student_grade.subject"%(student_id)

    #turn sql into data frame
    df_current_grades = pandas.read_sql(current_grades_sql, con=connection)
    df_all_grades = pandas.read_sql(all_grades_sql, con=connection)

    # disconnect from server
    connection.close()

    #only get GPA of core subjects
    df_core_grades = df_all_grades[df_all_grades["display_name"].isin(gpa_subjects_list)]
    df_grades_indexed=df_core_grades.pivot(index='grade_date', columns='display_name', values='grade')
    df_current_core_grades = df_current_grades[df_current_grades["display_name"].isin(gpa_subjects_list)]


    #put into dictionary to use in student_grades.html and student_hs.html template
    current_core_grades_dict=df_current_core_grades.set_index('display_name').to_dict('index')


    #get gpa
    df_points=df_grades_indexed.applymap(getPoints)
    df_points['gpa']=df_points.mean(axis=1)
    df_points=df_points.reset_index()
    gpa_values=df_points[['grade_date', 'gpa']].values
    gpa=df_points.sort_values('grade_date',0,False)['gpa'].iloc[0]

    return {'gpa':gpa, 'values':gpa_values, 'current_dict': current_core_grades_dict}

def get_test_score(student_id, test_type):
    student_scores=TestScore.objects.filter(student_id="%s"%(student_id))
    nwea_scores=student_scores.filter(test_name="%s"%(test_type))
    if len(student_scores.filter(subject="Mathematics"))>0:
        math_score = student_scores.filter(subject="Mathematics")[0].percentile
    else:
        math_score = "not available"

    if len(student_scores.filter(subject="Reading"))>0:
        reading_score = student_scores.filter(subject="Reading")[0].percentile
    else:
        reading_score = "not available"


    return {'read_pct': reading_score, 'math_pct':math_score}
