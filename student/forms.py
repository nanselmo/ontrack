from django import forms
#(in models.py)
from student.models import DataFile


class DataFileForm(forms.Form):
    document = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
