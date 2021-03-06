from student.models import  (Email, Attendance, TestScore, Student,
Grade, Roster, Assignment, STMathRecord, HighSchool,
NWEAPercentileConversion, Subject, SubjectInfo)
from django.db import connection
import math
import pandas
from datetime import datetime
from hardcoded import Q3_Start_Date, Q4_Start_Date
from dateutil import parser
import re
import os


#converts file to df and gets the date from the file name
def get_df(the_file, inMemory, file_type="CSV", file_kind=""):
    if inMemory == False:  #load it like a normally stored file
        file_name=the_file
        prepped_file=open(the_file,'rb')
    else:
        #if the file is inMemory, it was recently uploaded through the form
        #this means it has the fields .document which is the actual file
        #and .name which is the file name ("Grades-01-30-17.csv")
        prepped_file=the_file.document
        #get file date
        file_name= the_file.filename()

    chunksize = 500
    chunks = []
    if file_type == "CSV":
        for chunk in pandas.read_csv(prepped_file, chunksize=chunksize, iterator=True):
            chunks.append(chunk)
        df = pandas.concat(chunks, axis=0)
    elif file_type == "Excel":
        df = pandas.read_excel(prepped_file)

    # get date from filename, if exists
    date_re = re.compile(r"([0-9]?[0-9]-[0-9]?[0-9]-[0-9][0-9])\..*?$")
    date_match = date_re.search(file_name)
    if date_match == None:
        return (df, None)
    else:
        file_date = date_match.group(1)
        return(df, file_date)





#loads all student files that are in the student-directory
def loadStudents(the_file, inMemory=False):
    if inMemory == False:
        file_name=the_file
        prepped_file=open(the_file,'rb')
    else:
        prepped_file=the_file.document
        file_name= the_file.filename()

    #SIM files are excel and have a bunch of null rows to start/end
    df = pandas.read_excel(prepped_file, header=5, skip_footer=2)
    df = df.dropna(axis=['index', 'columns'], how='all')

    #set all student's current_student status to false
    all_students=Roster.objects.all()
    all_students.update(current_student=False)


    for i in range(0,len(df)):

        #update Student Model
        user=Student.objects.get_or_create(student_id=df.iloc[i]['ID'].astype(int))
        #in the SIM report, some student's first and last names are separated with " , " instead of ", "
        user[0].first_name=df.iloc[i]['Student Name (LFM)'].replace(" , ", ", ").split()[1]
        user[0].last_name=df.iloc[i]['Student Name (LFM)'].replace(" , ", ", ").split()[0].rstrip(',')
        user[0].gender=df.iloc[i]['Gender']
        user[0].birthdate=datetime.strptime(df.iloc[i]['Birth Date'], '%b %d, %Y')
        user[0].current_student=True
        user[0].save()

        #update Roster Model
        user_roster=Roster.objects.get_or_create(student_id=user[0].student_id)
        user_roster[0].hr_id=df.iloc[i]['HR(A)']
        user_roster[0].grade_level=df.iloc[i]['Gr(A)']
        #since they're in the SIM, set their current status to True
        user_roster[0].current_student=True
        user_roster[0].save()

    return(len(df))

def loadGrades(grades_file, inMemory=False):
    grades_df, file_date=get_df(grades_file, inMemory)


    grades_df=grades_df[grades_df['SubjectName']!='GEOMETRY']

    grades_df=grades_df.dropna(subset=["FinalAvg"])
    #take out students who have letter grades for their Final Avg
    clean_grades=grades_df[~grades_df['FinalAvg'].isin(["A", "B", "C","D", "F"])]
    df = clean_grades



    for i in range(0,len(df)):
         current_subject = df.iloc[i]['SubjectName']
         Subject.objects.get_or_create(subject_name=current_subject)
         Grade.objects.get_or_create(student_id=df.iloc[i]['StudentID'].astype(str),
                                 subject=current_subject,
                                 grade=df.iloc[i]['FinalAvg'],
                                 grade_date=datetime.strptime(file_date, '%m-%d-%y'))
    print str(len(df)) + ' grades records loaded from ' + file_date

    ###Check if Subject has associated SubjectInfo
    subject_list = Subject.objects.distinct()
    for cur_subject in subject_list:
        SubjectInfo.objects.get_or_create(subject=cur_subject)

    return(len(df))


def loadRITConversions(RIT_file, inMemory=False):
    rit_df = get_df(RIT_file, inMemory, "CSV", "RIT")

    #make from wide to long in order to write to database
    nwea_conversion_df_long = pandas.melt(rit_df,
                                          id_vars=['Percentile', 'Season', 'Subject'],
                                          value_vars=['2', '3', '4', '5', '6', '7', '8', '9', '10'],
                                          var_name='Grade',
                                          value_name="RIT")

    df = nwea_conversion_df_long

    for i in range(0,len(df)):
        conversion_instance = NWEAPercentileConversion.objects.get_or_create(
            subject = df.iloc[i]['Subject'],
            season = df.iloc[i]['Season'],
            grade_level = df.iloc[i]['Grade'],
            percentile = df.iloc[i]['Percentile'])
        #the RIT will score for every new norms table added
        #so this should be rewritten each time
        conversion_instance[0].rit = df.iloc[i]['RIT']
        conversion_instance[0].save()
    return(len(df))


def loadAttendance(attend_file, inMemory=False):

    attend_df, file_date = get_df(attend_file, inMemory)
    attend_df=attend_df.loc[attend_df['Attendance School'] == "CHAVEZ"]
    df = attend_df
    for i in range(0,len(df)):
         Attendance.objects.get_or_create(student_id=df.iloc[i]['Student ID'].astype(str),
                                total_days=df.iloc[i]['Membership Days'].astype(float),
                                absent_days=df.iloc[i]['Absences'].astype(float),
                                attend_date=datetime.strptime(file_date, '%m-%d-%y'))
    print str(len(df)) + ' attendance records loaded from ' + file_date
    return(len(df))

def loadNWEA(file, inMemory = False):
    test_score_df_raw, file_date=get_df(file, inMemory)
    test_score_df = test_score_df_raw[['StudentID', 'TermName', 'Discipline', 'TestRITScore', 'TestPercentile', 'TestStartDate']]
    df = test_score_df

    for i in range(0,len(df)):
            try:
                student = Student.objects.get(student_id=df.iloc[i]['StudentID'])
                test_instance=TestScore.objects.get_or_create(student_id=df.iloc[i]['StudentID'].astype(str),
                                        test_name='NWEA',
                                        test_session=df.iloc[i]['TermName'],
                                        subject=df.iloc[i]['Discipline'])
                test_instance[0].score=df.iloc[i]['TestRITScore']
                test_instance[0].percentile=df.iloc[i]['TestPercentile']
                test_instance[0].test_date = parser.parse(df.iloc[i]['TestStartDate'], dayfirst=False)
                test_instance[0].save()

            except Student.DoesNotExist:
                #student is no longer at Chavez
                pass
    return(len(df))

def loadHSInfo(file):
    hs_df= pandas.read_csv(open(file,'rb'))
    df=hs_df

    for i in range(0,len(df)):
        #handle if their are no null values in the points columns
        try:
           tier1 = int(df.iloc[i]['Tier1'])
        except ValueError:
           tier1 = None
        try:
           tier2 = int(df.iloc[i]['Tier2'])
        except ValueError:
           tier2 = None
        try:
           tier3 = int(df.iloc[i]['Tier3'])
        except ValueError:
           tier3 = None
        try:
           tier4 = int(df.iloc[i]['Tier4'])
        except ValueError:
           tier4 = None


        HighSchool.objects.get_or_create(short_name=df.iloc[i]['DisplayName'],
                        full_name=df.iloc[i]['FullName'],
                        website=df.iloc[i]['WebsiteURL'],
                        school_type=df.iloc[i]['Type'],
                        tier1_points=tier1,
                        tier2_points=tier2,
                        tier3_points=tier3,
                        tier4_points=tier4)


def loadEmail(file, inMemory=False):
    email_df, file_date=get_df(file, inMemory, file_type="Excel")
    email_df=email_df.loc[email_df['Note'] != 'Deleted']
    df=email_df

    for i in range(0,len(df)):
        print "Now loading email for " + df.iloc[i]['Logon ID']
        user_type=df.iloc[i]['User Category']
        if user_type=="Student":
            user= Email.objects.get_or_create(student_id=df.iloc[i]['Student ID'].astype(int))
        #staff don't have ids, use their cps username instead
        else:
            user= Email.objects.get_or_create(student_id=df.iloc[i]['Logon ID'].lower())
        user[0].email=df.iloc[i]['mail'].lower()
        user[0].user_type=user_type
        user[0].save()
    return(len(df))

def loadAssignments(file, inMemory=False):

    df, file_date=get_df(file, inMemory)

    #delete current quarter's assignments
    #names of assignments could have changed, as could their score - or even points possible, so need to delete all previous
    #Q4_Start_Date from hardcoded.py
    Assignment.objects.filter(grade_entered__gte=Q4_Start_Date).delete()
    print "Old Q4 Assignments Deleted"


    #load assignments

    #split df into chunks
    def chunker(seq, size):
        return (seq[pos:pos + size] for pos in xrange(0, len(seq), size))

    #load into df in chunks
    chunk_counter = 0
    for sub_df in chunker(df,500):
        for i in range(0,len(sub_df)):
            class_name=sub_df.iloc[i]['ClassName']
            Assignment.objects.get_or_create(student_id=sub_df.iloc[i]['StuStudentId'].astype(str),
                                            subject=re.search(re.compile(r"^[^\d]*"), class_name).group(0)[:-1],
                                            assign_name=sub_df.iloc[i]['ASGName'],
                                            assign_score=sub_df.iloc[i]['Score'],
                                            assign_score_possible=sub_df.iloc[i]['ScorePossible'],
                                            category_name=sub_df.iloc[i]['CategoryName'],
                                            category_weight=sub_df.iloc[i]['CategoryWeight'],
                                            assignment_due=datetime.strptime(sub_df.iloc[i]['AssignmentDue'], '%m/%d/%Y'),
                                            grade_entered=datetime.strptime(sub_df.iloc[i]['GradeEnteredOn'], '%m/%d/%Y'))
        chunk_counter = chunk_counter + 1
        print  'chunk' + str(chunk_counter)+ 'loaded'
    print str(len(df)) + ' total assignment records loaded for '   + file_date
    return(len(df))


def loadJiJi(file, inMemory=False):
    df, file_date=get_df(file, inMemory)
    for i in range(0,len(df)):
             STMathRecord.objects.get_or_create(student_id = df.iloc[i]['school_student_id'].astype(str),
                                     gcd = df.iloc[i]['GCD'],
                                     num_lab_logins = df.iloc[i]['num_lab_logins'],
                                     k_5_progress = df.iloc[i]['K_5_Progress'],
                                     k_5_mastery = df.iloc[i]['K_5_Mastery'],
                                     curr_hurdle = df.iloc[i]['curr_hurdle_num_tries'],
                                     curr_objective = df.iloc[i]['objective_name'],
                                     total_time = df.iloc[i]['alt_src_time'],
                                     metric_date=datetime.strptime(file_date, '%m-%d-%y'))

    return(len(df))

def loadFile(file):

 if  "SIM" in file:
    loadStudents(file)
 elif "Attendance" in file:
    loadAttendance(file)
 elif "Grades" in file:
    loadGrades(file)
 elif "NWEA" in file:
    loadNWEA(file)
 elif "HS_Points" in file:
    loadHSInfo(file)
 elif "Email" in file:
    loadEmail(file)
 elif "Assign" in file:
    loadAssignments(file)
