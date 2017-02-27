from django.core.management import BaseCommand
from student.models import  Email, Attendance, TestScore, Student, Grade
from django.db import connection
import math
import pandas
from os import listdir
from os.path import isfile, join
from loadOnTrackData import *






#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the database will all files in Student Data directory"

    # A command must define handle()
    def handle(self, *args, **options):

        #in python anywhere: /home/ontrack/ontrack/student-data
        data_dir="ontrack/student-data/"

        data_files = [join(data_dir, f) for f in listdir(data_dir) if isfile(join(data_dir, f))]
        data_files

        sim_files = [elem for elem in data_files if "SIM" in elem]
        non_sim_files = [elem for elem in data_files if "SIM" not in elem]
        sim_files=sorted(sim_files)

        #load most recent sim file
        recent_sim=sim_files[-1]
        loadFile(recent_sim)
        print (recent_sim +" has been loaded")

        #load other files
        for each_file in non_sim_files:
            loadFile(each_file)
            print (each_file +" has been loaded")
