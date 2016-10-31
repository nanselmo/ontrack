from django.core.management import BaseCommand
import sys,os
from student.models import Grade, Subject
import csv
from django.db import connection
import pandas
from datetime import datetime



grades_file='ontrack/student-data/Grades-09-16-16.csv'



#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the Grades DB with CSV file. CSV file should be saved as a Windows CSV"

    # A command must define handle()
    def handle(self, *args, **options):
        grades_df = pandas.read_csv(open(grades_file,'rb'))
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

        self.stdout.write("Done Loading Grades")
