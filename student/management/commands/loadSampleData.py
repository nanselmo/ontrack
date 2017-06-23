from django.core.management import BaseCommand
from student.models import  Email, Attendance, TestScore, Student, Grade
from django.db import connection
import math
import pandas
from datetime import datetime
from os import listdir
from os.path import isfile, join

### in progress!


def loadGrades(gradesCSV_sample):
    col_types = [str, str, int, str]
    with open(gradesCSV_sample) as f:
        f_csv = csv.reader(f)
        headers = next(f_csv)
        for row in f_csv:
            # Apply conversions to the row items
            row = tuple(convert(value) for convert, value in zip(col_types, row))
            student_id = row[0]
            subject_name = row[1]
            grade=row[2]
            grade_date=row[3]
            Grade.objects.get_or_create(grade=grade, subject=subject_name, student_id=student_id, grade_date=grade_date)



def loadAttendance(samp_attend_file):
    col_types = [str, float, float, str]
    with open(samp_attend_file) as f:
        f_csv = csv.reader(f)
        headers = next(f_csv)
    for row in f_csv:
        # Apply conversions to the row items
        row = tuple(convert(value) for convert, value in zip(col_types, row))
        Attendance.objects.get_or_create( student_id=row[0],total_days=row[1],absent_days=row[2], attend_date=row[3])





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







def loadFile(file):


 if "Attendance" in file:
    loadAttendance(file)
 elif "Grades" in file:
    loadGrades(file)
 elif "NWEA" in file:
    loadNWEA(file)




#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the database will all files in Student Data directory"

    # A command must define handle()
    def handle(self, *args, **options):




        data_dir="ontrack/student-data/"
        data_files = [join(data_dir, f) for f in listdir(data_dir) if isfile(join(data_dir, f))]
        data_files

        sample_files = [elem for elem in data_files if "Sample" in elem]


        #load other files
        for each_file in sample_files:
            loadFile(each_file)
