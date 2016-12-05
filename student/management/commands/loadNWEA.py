from django.core.management import BaseCommand
import sys,os
from student.models import Grade, Student, Attendance, TestScore
from student.ontrack import get_user_id, getOnTrack, getPoints, gpa_subjects_list
import csv
from django.db import connection
import pandas
from datetime import datetime



test_scores_file='ontrack/student-data/NWEA-SPR1516.csv'



#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the TestScore table with NWEA Data (need CDF csv file)"

    # A command must define handle()
    def handle(self, *args, **options):
        grades_df_raw = pandas.read_csv(open(test_scores_file,'rb'))
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

        self.stdout.write("Done Loading NWEA Scores")
