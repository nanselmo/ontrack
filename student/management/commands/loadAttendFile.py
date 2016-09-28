from django.core.management import BaseCommand
import sys,os
from student.models import Attendance
import csv
from django.db import connection



import pandas
from datetime import datetime

attend_file='ontrack/student-data/Attendance-09-23-16.csv'
attend_df = pandas.read_csv(open(attend_file,'rb'))
attend_df = attend_df.loc[attend_df['Attendance School'] == "CHAVEZ"]

#get date of file
file_date_start=attend_file.find('Attendance-') + 11
file_date_end= attend_file.find('.csv', file_date_start)
file_date = attend_file[file_date_start:file_date_end]


#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the Attendance DB with CPS' CSV file"

    # A command must define handle()
    def handle(self, *args, **options):
        df=attend_df
        for i in range(0,len(df)):
             Attendance.objects.get_or_create(student_id=df.iloc[i]['Student ID'].astype(str),
                                    total_days=df.iloc[i]['Membership Days'].astype(float),
                                    absent_days=df.iloc[i]['Absences'].astype(float),
                                    attend_date=datetime.strptime(file_date, '%m-%d-%y'))

        self.stdout.write("Done Loading Attendance File")
