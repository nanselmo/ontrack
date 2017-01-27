from django.core.management import BaseCommand
import sys,os
from student.models import Email
from django.db import connection
import pandas

#download from https://adam.fc.cps.edu/fcpwrst/default.asp and save as .xls
email_file='ontrack/student-data/Email-10-21-16.xls'



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
            user[0].user_type=df.iloc[i]['User Category']
            user[0].save()



        self.stdout.write("Done Loading Email File")
