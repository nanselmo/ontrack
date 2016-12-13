from student.models import  Email, Attendance, TestScore, Student, Grade
from allauth.socialaccount.models import SocialAccount
from django.db import connection
import math
import pandas
from datetime import datetime
from os import listdir
from os.path import isfile, join


#loads all student files that are in the student-directory
def loadStudents(file):
    df = pandas.read_excel(open(simXLS,'rb'), header=5, skip_footer=2)
    df = df.dropna(axis=['index', 'columns'], how='all')


    for i in range(0,len(df)):
        user=Student.objects.get_or_create(student_id=df.iloc[i]['ID'].astype(int))
        #in the SIM report, some student's first and last names are separated with " , " instead of ", "
        user[0].first_name=df.iloc[i]['Student Name (LFM)'].replace(" , ", ", ").split()[1]
        user[0].last_name=df.iloc[i]['Student Name (LFM)'].replace(" , ", ", ").split()[0].rstrip(',')
        user[0].gender=df.iloc[i]['Gender']
        user[0].birthdate=datetime.strptime(df.iloc[i]['Birth Date'], '%b %d, %Y')

def loadGrades(file):
    grades_df = pandas.read_csv(open(file,'rb'))
    grades_df=grades_df[grades_df['SubjectName']!='GEOMETRY']

    #get file date
    file_date_start=grades_file.find('Grades-') + 7
    file_date_end= grades_file.find('.csv', file_date_start)
    file_date = grades_file[file_date_start:file_date_end]

    grades_df=grades_df.dropna(subset=["QuarterAvg"])
    #take out students who have the letters B or C in their Quarter Avg
    clean_grades=grades_df[~grades_df['QuarterAvg'].isin(["B", "C"])]
    df = clean_grades

    for i in range(0,len(df)):
        Grade.objects.get_or_create(student_id=df.iloc[i]['StudentID'].astype(str),
                                subject=df.iloc[i]['SubjectName'],
                                grade=df.iloc[i]['QuarterAvg'],
                                grade_date=datetime.strptime(file_date, '%m-%d-%y'))


def loadAttendance(attend_file):
    attend_df = pandas.read_csv(open(attend_file,'rb'))
    attend_df = attend_df.loc[attend_df['Attendance School'] == "CHAVEZ"]

    #get date of file
    file_date_start=attend_file.find('Attendance-') + 11
    file_date_end= attend_file.find('.csv', file_date_start)
    file_date = attend_file[file_date_start:file_date_end]

    df=attend_df
    for i in range(0,len(df)):
         Attendance.objects.get_or_create(student_id=df.iloc[i]['Student ID'].astype(str),
                                total_days=df.iloc[i]['Membership Days'].astype(float),
                                absent_days=df.iloc[i]['Absences'].astype(float),
                                attend_date=datetime.strptime(file_date, '%m-%d-%y'))


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



#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the database will all files in Student Data directory"
    data_dir="ontrack/student-data/"
    # A command must define handle()
    def handle(self, *args, **options):
        data_files = [join(data_dir, f) for f in listdir(data_dir) if isfile(join(data_dir, f))]
        data_files

        sim_files = [elem for elem in data_files if "SIM" in elem]
        non_sim_files = [elem for elem in data_files if "SIM" not in elem]
        sim_files=sorted(sim_files)

        #load most recent sim file
        recent_sim=sim_files[-1]
        loadFile(recent_sim)

        #load other files
        for each_file in non_sim_files:
            loadFile(each_file)
