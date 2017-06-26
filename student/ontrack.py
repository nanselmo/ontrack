from student.models import  Email, Attendance, TestScore
from student.helper_functions import df_from_query
from allauth.socialaccount.models import SocialAccount
from django.db import connection
import math
import gviz_api

#sql to pandas
import pandas
from django.db import connection


#variables
gpa_subjects_list = ['Math', 'Science', 'Social Studies', 'Reading' ]
take_out_subjects_list=['Speaking', 'Listening']
gpa_subjects_list_full_names=['CHGO READING FRMWK','MATHEMATICS STD','SCIENCE  STANDARDS','SOCIAL SCIENCE STD']

#functions

def get_user_info(the_request, student_id=1):
    try:
        social_email = SocialAccount.objects.get(user=the_request.user).extra_data['email']
        user_type = Email.objects.get(email=social_email).user_type
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

def get_gpa(group_id, range="current", group_type="student"):
    
    if group_type=="student":
        all_grades_sql = "SELECT grade, grade_date, subject_name, MAX(created),  display_name \
            FROM student_grade, student_subject, student_subjectinfo  \
            WHERE student_grade.student_id=%s \
                AND student_grade.subject_id=student_subject.subject_name  \
                AND student_subject.subject_name=student_subjectinfo.subject_id\
            GROUP BY student_grade.grade_date, subject_name \
            ORDER BY date(grade_date) DESC"
        all_grades_params = [group_id]

        current_grades_sql="SELECT grade, MAX(grade_date) as most_recent_grade_date, subject_name, display_name, image \
            FROM student_grade, student_subject, student_subjectinfo \
            WHERE student_id=%s \
                AND student_subject.subject_name=student_grade.subject_id  \
                AND student_subject.subject_name=student_subjectinfo.subject_id\
            GROUP BY student_grade.subject_id"
        current_grades_params = [group_id]
    else:
        if group_type == "hr":
            all_grades_sql = "SELECT grade, grade_date, subject_name, MAX(created),  display_name,  \
                student_roster.student_id \
                FROM student_roster, student_grade, student_subject, student_subjectinfo \
                WHERE hr_id=%s AND  \
                    student_grade.student_id=student_roster.student_id AND  \
                    student_subject.subject_name=student_grade.subject_id AND \
                    student_subject.subject_name = student_subjectinfo.subject_id \
                GROUP BY student_roster.student_id, student_grade.subject_id\
                ORDER BY date(grade_date) DESC"
            all_grades_params = [group_id]

            current_grades_sql = "SELECT grade, MAX(grade_date) as recent_grade_date, display_name,  \
                student_roster.student_id \
                FROM student_roster, student_grade, student_subject, student_subjectinfo \
                WHERE hr_id=%s AND  \
                    student_grade.student_id=student_roster.student_id AND  \
                    student_subject.subject_name=student_grade.subject_id AND\
                    student_subject.subject_name=student_subjectinfo.subject_id \
                GROUP BY student_roster.student_id, student_grade.subject_id"
            current_grades_params = [group_id]

    #turn sql into data frame
    df_all_grades = df_from_query(all_grades_sql, all_grades_params, connection=connection)
    df_current_grades = df_from_query(current_grades_sql, current_grades_params, connection=connection)

    ##for historical grades
    df_core_historical_grades = df_all_grades[df_all_grades["display_name"].isin(gpa_subjects_list)]
    df_historical_grades_indexed=df_core_historical_grades.pivot(index='grade_date', columns='display_name', values='grade')

    ##for current grades
    df_current_core_grades = df_current_grades[df_current_grades["display_name"].isin(gpa_subjects_list)]


    #calculate gpa
    df_points=df_historical_grades_indexed.applymap(getPoints)
    df_points['gpa']=df_points.mean(axis=1)
    df_points=df_points.reset_index()
    gpa_values=df_points[['grade_date', 'gpa']].values
    current_gpa=df_points.sort_values('grade_date',0,False)['gpa'].iloc[0]

    gpa={'current_gpa' : current_gpa, 'values' : gpa_values}
    if range == "current":
        grades_df = df_current_core_grades
    else:
        grades_df = df_historical_grades_indexed
    return {'gpa': gpa, 'grades_df': grades_df}


def get_test_score(student_id, test_type):
    student_scores=TestScore.objects.filter(student_id="%s"%(student_id))
    nwea_scores=student_scores.filter(test_name="%s"%(test_type))
    if len(student_scores.filter(subject="Mathematics"))>0:
        math_info = student_scores.filter(subject="Mathematics").order_by('-test_date')[0]
        math_score = math_info.score
        math_percentile = math_info.percentile
    else:
        math_score = "not available"
        math_percentile = "not available"

    if len(student_scores.filter(subject="Reading"))>0:
        reading_info = student_scores.filter(subject="Reading").order_by('-test_date')[0]
        reading_score = reading_info.score
        reading_percentile = reading_info.percentile
    else:
        reading_score = "not available"
        reading_percentile = "not available"

    return {'read_pct': reading_percentile, 'read_score' : reading_score,
            'math_pct':math_percentile, 'math_score' : math_score}

def get_grade_distribution(hr):
    
    if hr=="All":
        current_grades_sql="SELECT grade, MAX(grade_date) as most_recent_grade_date, subject_name, display_name, hr_id, grade_level, current_student \
            FROM student_grade, student_subject, student_roster, student_subjectinfo \
            WHERE student_subject.subject_name=student_grade.subject_id \
                 AND student_grade.student_id=student_roster.student_id\
                 AND student_subject.subject_name = student_subjectinfo.subject_id\
            GROUP BY student_grade.subject_id, student_grade.student_id"
        params = None

    else:
        current_grades_sql="SELECT grade, MAX(grade_date) as most_recent_grade_date, subject_name, display_name, hr_id, grade_level, current_student \
            FROM student_grade, student_subject, student_roster, student_subjectinfo \
            WHERE student_subject.subject_name=student_grade.subject_id \
                AND student_grade.student_id=student_roster.student_id \
                AND student_roster.hr_id=%s\
                AND student_subject.subject_name = student_subjectinfo.subject_id\
            GROUP BY student_grade.subject_id, student_grade.student_id"
        params = [hr]

    df_current_grades = df_from_query(current_grades_sql, params, connection=connection) 

    #only show for current students, then drop current_student column
    df_current_grades=df_current_grades[df_current_grades.current_student==True]
    df_current_grades.drop('current_student', axis=1, inplace=True)

    #just get the core subjects
    df_current_core_grades=df_current_grades[df_current_grades['display_name'].isin(gpa_subjects_list)]


    #get the mean grades
    average_grades=df_current_core_grades.groupby(["display_name", "grade_level"]).mean().reset_index()
    grades_by_grade=average_grades.pivot(index="grade_level", columns="display_name", values="grade")

    #get header for GViz bar chart
    grades_by_grade=grades_by_grade.reset_index()
    headers=grades_by_grade.columns.values.tolist()

    #get values
    core_grades_avg_list=grades_by_grade.values.tolist()

    #combine them, but put the headers in it's own array
    gviz_grades_list=[headers]+core_grades_avg_list


    def letter_grade(num_grade):
        if num_grade>90:
            letter="A"
        elif num_grade>80:
            letter="B"
        elif num_grade>70:
            letter="C"
        elif num_grade>60:
            letter="D"
        else:
            letter="F"
        return letter


    df_current_core_grades['QrtrLetter']=df_current_core_grades.apply(lambda each_grade: letter_grade(each_grade['grade']), axis=1)


    #get breakdown for a single subject and output as json
    if hr!="All":
        df_current_core_grades=df_current_core_grades[df_current_core_grades["hr_id"]==hr]

    hr_grades=df_current_core_grades.groupby(['display_name','QrtrLetter']).size().reset_index(name="NumofStudents")



    all_subjects=hr_grades['display_name'].unique()

    all_subjects_array=[]
    for subject in all_subjects:
        cur_df=hr_grades[hr_grades['display_name']==subject]
        grade_values=cur_df[['QrtrLetter', 'NumofStudents']].values.tolist()
        new_array=[subject , grade_values]
        all_subjects_array.append(new_array)

    return(all_subjects_array, gviz_grades_list)
