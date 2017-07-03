from django.shortcuts import render, redirect
from student.forms import DataFileForm
from student.summerschool import get_ss_report

def upload_summer_school(request):
    if request.method == 'POST':
        #DataFileForm is a class defined in forms.py
        upload_form = DataFileForm(request.POST, request.FILES)
        if upload_form.is_valid():
                file_list=request.FILES.getlist('document')
                #returns two dataframes with summer school status (using the uploaded files)
                full_roster, ss_list=get_ss_report(file_list, in_mem=True)
                #save the dataframes in the session - but must be saved as JSON
                request.session['ss_kids'] = ss_list.to_json()
                request.session['full_roster'] = full_roster.to_json()
                #go to the success page
                return redirect( 'download_ss')

    else:
            #an empty form
            upload_form = DataFileForm()
            message="Upload a File"


    return render(request, 'student/summerschool_upload.html', {'display_form': upload_form})

