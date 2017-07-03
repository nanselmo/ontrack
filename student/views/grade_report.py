from django.shortcuts import render
from student.forms import DataFileForm 

def grade_report(request):

    #commented out on 04/26/17 because python anywhere is having trouble finding
    #the teacher_div file, need to set student_data in a static directory or
    #move teacher_div to a database
    #template_vars= generate_grade_audit(num="admin")

    if request.method == 'POST':
        #DataFileForm is a class defined in forms.py
        upload_form = DataFileForm(request.POST, request.FILES)
        if upload_form.is_valid():
                file_list=request.FILES.getlist('document')

                #save the dataframes in the session - but must be saved as JSON
                #request.session['ss_kids'] = ss_list.to_json()
                #request.session['full_roster'] = full_roster.to_json()
                #go to the success page
                #return redirect('download_ss')

    else:
            #an empty form
            upload_form = DataFileForm()
            #message="Upload The Grades Files"

    template_vars = {}

    return render(request, "student/grade_report.html", template_vars)

