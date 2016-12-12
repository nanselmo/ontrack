from django.core.management import BaseCommand
import sys,os
from student.models import Email
from django.db import connection
import pandas

email_file='ontrack/student-data/Email-10-21-16.xls'



#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the Email Table with CPS' School Email file (from adam.fc.cps.edu)"

    # A command must define handle()
    def handle(self, *args, **options):
