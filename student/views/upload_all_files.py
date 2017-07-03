from django.shortcuts import render
from student.forms import (DataFile, DataFileForm)
from student.loadOnTrackData import (loadGrades, loadAttendance, loadEmail, loadAssignments, loadStudents, loadRITConversions, loadNWEA, loadJiJi)

# upload_all_files
def upload_all_files(request):
    if request.method == 'POST':
        #DataFileForm is a class defined in forms.py
        upload_form = DataFileForm(request.POST, request.FILES)
        if upload_form.is_valid():
            message=""
            for each_file in request.FILES.getlist('document'):
                newfile = DataFile(document = each_file)
                if "Grade" in str(each_file):
                    num_data_points=loadGrades(newfile, inMemory=True)
                    message= message + str(num_data_points) + " grades have been updated. "
                elif "Attend" in str(each_file):
                    num_data_points=loadAttendance(newfile, inMemory=True)
                    message= message + str(num_data_points) + " attendance records have been updated. "
                elif "Email" in str(each_file):
                    num_data_points=loadEmail(newfile, inMemory=True)
                    message= message + str(num_data_points) + " emails records have been updated. "
                elif "Assign" in str(each_file):
                    num_data_points=loadAssignments(newfile, inMemory=True)
                    message= message + str(num_data_points) + " assignments have been updated. "
                elif "SIM" in str(each_file):
                    num_data_points=loadStudents(newfile, inMemory=True)
                    message= message + str(num_data_points) + " students have been updated. "
                elif "RIT" in str(each_file):
                    num_data_points = loadRITConversions(newfile, inMemory=True)
                    message = message + str(num_data_points) + " RIT conversions have been updated"
                elif "NWEA" in str(each_file):
                    num_data_points=loadNWEA(newfile, inMemory=True)
                    message= message + str(num_data_points) + " test scores have been updated. "
                elif "ST" in str(each_file):
                    num_data_points=loadJiJi(newfile, inMemory=True)
                    message= message + str(num_data_points) + " students in JiJi have been updated. "

                else:
                    num_data_points=0
                    message=message+ str(each_file) + " not named correctly. Please rename it with the convention Grades-XX-XX-XX.csv or Attendance-XX-XX-XX.csv"
                #no longer need to show the upload form
            upload_form=""

    else:
            #an empty form
            upload_form = DataFileForm()
            message="Upload Your School's Files"

    return render(request, "student/upload_files.html", {"social_email": None })
