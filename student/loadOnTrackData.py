from student.models import  Email, Attendance, TestScore, Student, Grade
from django.db import connection
import math
import pandas
from datetime import datetime

#converts file to df and gets the date from the file name
def get_df(the_file, inMemory):
    if inMemory==False: #load it like a normally stored file
        df = pandas.read_csv(open(the_file,'rb'))
        file_name=the_file

    else:
        #if the file is inMemory, it was recently uploaded through the form
        #this means it has the fields .document which is the actual file
        #and .name which is the file name ("Grades-01-30-17.csv")
        df = pandas.read_csv(the_file.document)
        #get file date
        file_name= the_file.filename()

    file_date_start=file_name.find('-') + 1
    file_date_end= file_date_start + 8
    file_date = file_name[file_date_start:file_date_end]
    return(df, file_date)



#loads all student files that are in the student-directory
def loadStudents(simXLS):
    df = pandas.read_excel(open(simXLS,'rb'), header=5, skip_footer=2)
    df = df.dropna(axis=['index', 'columns'], how='all')


    for i in range(0,len(df)):
        user=Student.objects.get_or_create(student_id=df.iloc[i]['ID'].astype(int))
        #in the SIM report, some student's first and last names are separated with " , " instead of ", "
        user[0].first_name=df.iloc[i]['Student Name (LFM)'].replace(" , ", ", ").split()[1]
        user[0].last_name=df.iloc[i]['Student Name (LFM)'].replace(" , ", ", ").split()[0].rstrip(',')
        user[0].gender=df.iloc[i]['Gender']
        user[0].birthdate=datetime.strptime(df.iloc[i]['Birth Date'], '%b %d, %Y')
        user[0].save()

def loadGrades(grades_file, inMemory=False):
    grades_df, file_date=get_df(grades_file, inMemory)


    grades_df=grades_df[grades_df['SubjectName']!='GEOMETRY']

    grades_df=grades_df.dropna(subset=["QuarterAvg"])
    #take out students who haveletter grades for their Quarter Avg
    clean_grades=grades_df[~grades_df['QuarterAvg'].isin(["A", "B", "C","D", "F"])]
    df = clean_grades
    print df
    for i in range(0,len(df)):
         print "Now loading " + df.iloc[i]['StudentID'].astype(str) + " " + df.iloc[i]['SubjectName']
         Grade.objects.get_or_create(student_id=df.iloc[i]['StudentID'].astype(str),
                                 subject=df.iloc[i]['SubjectName'],
                                 grade=df.iloc[i]['QuarterAvg'],
                                 grade_date=datetime.strptime(file_date, '%m-%d-%y'))
    print str(len(df)) + ' grades loaded from ' + file_date
    return(len(df))






def loadAttendance(attend_file, inMemory=False):

    attend_df, file_date=get_df(attend_file, inMemory)
    attend_df=attend_df.loc[attend_df['Attendance School'] == "CHAVEZ"]
    df = attend_df
    for i in range(0,len(df)):
         print "Now loading Attendance for StudentID: " + df.iloc[i]['StudentID'].astype(str) 
         Attendance.objects.get_or_create(student_id=df.iloc[i]['Student ID'].astype(str),
                                total_days=df.iloc[i]['Membership Days'].astype(float),
                                absent_days=df.iloc[i]['Absences'].astype(float),
                                attend_date=datetime.strptime(file_date, '%m-%d-%y'))
    print str(len(df)) + ' attendance records loaded from ' + file_date
    return(len(df))

def loadNWEA(file):
    grades_df_raw = pandas.read_csv(open(file,'rb'))
    grades_df=grades_df_raw[['StudentID', 'TermName', 'Discipline', 'TestRITScore', 'TestPercentile']]
    df=grades_df

    for i in range(0,len(df)):
            try:
                student = Student.objects.get(student_id=df.iloc[i]['StudentID'])
                TestScore.objects.get_or_create(student_id=df.iloc[i]['StudentID'].astype(str),
                                        test_name='NWEA',
                                        score=df.iloc[i]['TestRITScore'],
                                        percentile=df.iloc[i]['TestPercentile'],
                                           test_session=df.iloc[i]['TermName'],
                                           subject=df.iloc[i]['Discipline'])
            except Student.DoesNotExist:
                #student is no longer at Chavez
                pass

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


def loadEmail(file):
    email_df = pandas.read_excel(open(file,'rb'))
    email_df=email_df.loc[email_df['Note'] != 'Deleted']
    df=email_df

    for i in range(0,len(df)):
        user= Email.objects.get_or_create(student_id=df.iloc[i]['Student ID'].astype(int))
        user[0].email=df.iloc[i]['mail']
        user[0].user_type=df.iloc[i]['User Category']
        user[0].save()





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
