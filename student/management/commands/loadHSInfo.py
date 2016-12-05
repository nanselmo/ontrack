from django.core.management import BaseCommand
import sys,os
from student.models import HighSchool
import csv
from django.db import connection
import pandas



hs_file='ontrack/student-data/HS_Points_1617.csv'



#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Populates the HighSchool table with the CPS HS info - created that csv from CPS' HS calculator xlsx"

    # A command must define handle()
    def handle(self, *args, **options):
        hs_df= pandas.read_csv(open(hs_file,'rb'))
        df=hs_df

        for i in range(0,len(df)):
            #handle if their are no null values in the points columns
            try:
               tier1 = int(df.iloc[i]['Tier1'])
            except ValueError:
               tier1 = None
            try:
               tier2 = int(df.iloc[i]['Tier2'])
            except ValueError:
               tier2 = None
            try:
               tier3 = int(df.iloc[i]['Tier3'])
            except ValueError:
               tier3 = None
            try:
               tier4 = int(df.iloc[i]['Tier4'])
            except ValueError:
               tier4 = None


            HighSchool.objects.get_or_create(short_name=df.iloc[i]['DisplayName'],
                            full_name=df.iloc[i]['FullName'],
                            website=df.iloc[i]['WebsiteURL'],
                            school_type=df.iloc[i]['Type'],
                            tier1_points=tier1,
                            tier2_points=tier2,
                            tier3_points=tier3,
                            tier4_points=tier4)

        self.stdout.write("Done Loading HS Info")
