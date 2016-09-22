Skip to content
This repository
Search
Pull requests
Issues
Gist
 @nanselmo
 Watch 0
  Star 0
 Fork 0 nanselmo/ontrack
 Code  Issues 0  Pull requests 0  Projects 0  Wiki  Pulse  Graphs  Settings
Branch: master Find file Copy pathontrack/student/management/commands/loadStudents.py
6798707  13 days ago
 Nicki Anselmo added test users and emails
0 contributors
RawBlameHistory
36 lines (27 sloc)  1.33 KB
from django.core.management import BaseCommand
import sys,os
from student.models import Attendance
import csv
from django.db import connection


#LOCATION OF YOUR DJANGO PROJECTS
sys.path.append('Users/administrator/Desktop/django-ontrack')
os.environ['DJANGO_SETTINGS_MODULE']= 'settings'

#make sure csv is saved as a microsof or ms-dos csv. the default on Mac will not work
simXLS = "/Users/administrator/Desktop/django-ontrack/ontrack/ontrack/student-data/attend_win.csv"
#grades_file = csv.reader(open(), dialect='excel', delimiter=',')


#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the Student Table with CPS' SIM XLS"

    # A command must define handle()
    def handle(self, *args, **options):
        #define the data types for each column
        col_types = [str, float, float, str]

        with open(attendanceCSV) as f:
            f_csv = csv.reader(f)
            headers = next(f_csv)
            for row in f_csv:
                # Apply conversions to the row items
                row = tuple(convert(value) for convert, value in zip(col_types, row))
                Attendance.objects.get_or_create( student_id=row[0],total_days=row[1],absent_days=row[2], attend_date=row[3])

        self.stdout.write("Done Loading Attendance File")
Contact GitHub API Training Shop Blog About
© 2016 GitHub, Inc. Terms Privacy Security Status Help
