from django.core.management import BaseCommand
import sys,os
from student.models import Email
from django.db import connection
import pandas

email_file='ontrack/student-data/Usernames-10-04-16.xls'



#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the Email Table with CPS' School Email file (from adam.fc.cps.edu)"

    # A command must define handle()
    def handle(self, *args, **options):
        email_df = pandas.read_excel(open(email_file,'rb'))
        email_df=email_df.loc[email_df['Note'] != 'Deleted']
        df=email_df

        for i in range(0,len(df)):
            user= Email.objects.get_or_create(student_id=df.iloc[i]['Student ID'].astype(int))
            user[0].email=df.iloc[i]['mail']



        self.stdout.write("Done Loading Email File")
