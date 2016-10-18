from django.core.management import BaseCommand
import sys,os
from student.models import Grade, Subject
import csv
from django.db import connection
import pandas
from datetime import datetime



grades_file='ontrack/student-data/Grades-10-17-16.csv'



#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the Grades DB with CSV file. CSV file should be saved as a Windows CSV"

    # A command must define handle()
    def handle(self, *args, **options):
        grades_df = pandas.read_csv(open(grades_file,'rb'))
        grades_df


        #get file date
        file_date_start=grades_file.find('Grades-') + 7
        file_date_end= grades_file.find('.csv', file_date_start)
        file_date = grades_file[file_date_start:file_date_end]

        #add column for subject_id
        subjects=grades_df.SubjectName.unique()
        subjects.sort()

        subject_id_df=pandas.DataFrame(data=subjects)
        subject_id_df = subject_id_df.rename(columns={0: 'SubjectName'})
        subject_id_df['SubjectID'] = subject_id_df.index + 1
        for i in range(0,len(subject_id_df.index)):
            subject=Subject.objects.get_or_create(subject_id=subject_id_df.iloc[i]['SubjectID'])
            subject[0].subject_name=subject_id_df.iloc[i]['SubjectName']
            subject[0].save()


        subject_dict=subject_id_df.set_index('SubjectName').to_dict()
        subject_dict=subject_dict['SubjectID']

        grades_df['SubjectID'] = grades_df['SubjectName'].map(subject_dict)
        grades_df=grades_df.dropna(subset=["QuarterAvg"])
        #take out students who have the letters B or C in their Quarter Avg
        clean_grades=grades_df[~grades_df['QuarterAvg'].isin(["B", "C"])]
        df = clean_grades

        for i in range(0,len(df)):
            Grade.objects.get_or_create(student_id=df.iloc[i]['StudentID'].astype(str),
                                    subject_id=df.iloc[i]['SubjectID'],
                                    #grade=df.iloc[i]['QuarterAvg'].astype(int),
                                    grade=df.iloc[i]['QuarterAvg']
                                    grade_date=datetime.strptime(file_date, '%m-%d-%y'))

        self.stdout.write("Done Loading Grades")
