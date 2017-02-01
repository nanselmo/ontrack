from django import forms
#(in models.py)
from student.models import DataFile


class DataFileForm(forms.Form):
    document = forms.FileField(
        label='Select a file to upload',
        help_text='File type should be .csv')
