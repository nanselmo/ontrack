# OnTrack
Consumes CPS data, built using Django

## Getting Started
### Create VENV with Python 2.7
If you have conda (recommended)

  >>conda create --name venv python=2.7

If you have virtualenv/pip
  >>virtualenv venv

###Load Requirements
    >>pip install -r requirements.txt

### Add Student Data Files
* Create new directory:  ontrack/ontrack/student-data
* Copy student files into the student-data directory
  * SIM
  * Grades
  * Attendance
  * Email
  * HS Points File
  * Teacher Section File
  * NWEA Rit to Percentile File

### Set Environment Variables

In venv/bin/activate

    DEBUG=True
    export DEBUG

    SECRET_KEY="---YOUR-KEY-HERE-----"
    export SECRET_KEY

    DATABASE_URL=dev-db.sqlite3
    export DATABASE_URL

    DJANGO_SETTINGS_MODULE=ontrack.settings
    export DJANGO_SETTINGS_MODULE

    MY_ENV="development"
    export MY_ENV

    MY_SITE_ID=2
    export MY_SITE_ID



### Set up Database (using migrations)

First create a superuser for the database

    >>python manage.py createsuperuser
Then migrate to add all of the models and their corresponding fields to your local db. The raw code that sets up the local db is in the student/migrations directory

    >>python manage.py makemigrations
    >>python manage.py migrate

### Setup OAuth (Google)

####Start The Server
The server can be started at anytime and will run on port 8000 by default. Any changes locally will get picked up automatically without a need to constantly stop and restart the server

    >>python manage.py runserver

#### Add A New Site Instance
Navigate to the Admin DB GUI: localhost:8000/admin and click on the Sites model. Add a new Site with the following properties

* Domain Name: localhost:8000
* Display Name: LocalHost (or whatever you want)

####Confirm your SITE_ID #
This ID is auto-generated when you add to the Sites Model and will need to match the SITE_ID in ontrack/settings.py

    #(in python console or jupyter)
    from django.contrib.sites.models import Site
    Site.objects.all().values()

Change the environment variable 'MY_SITE_ID' (as needed) in venv/bin/activate

####Add Google OAuth as A Social Application
From [Google Developers API](https://console.developers.google.com/apis)
* Client ID (from Google)
* Secret Key (from Google)

Link the Social Application to the localhost Site instance

### Load Student Data
  >>python manage.py loadStudentData

###Add Yourself as a User
Go to localhost:8000/admin  and add a new Email object with your gmail address and User Type

###Populate Subject Model
For now, manually populate the Subjects Table with the following subjects and display names
* CHGO READING FRMWK - Reading
* MATHEMATICS STD - Math
* SCIENCE  STANDARDS - Science (NOTE the TWO spaces in between)
* SOCIAL SCIENCE STD - Social Studies

Also choose subject icons to use. These will get saved to the media directory of the app
