from django.shortcuts import render

def logon(request):
    return render(request, "student/logon.html")
