from django.contrib import admin
from .models import Student,Grade,Subject, Attendance, Email, Roster, Profile, TestScore


# Register your models here.
admin.site.register(Student)
admin.site.register(Grade)
admin.site.register(Subject)
admin.site.register(Attendance)
admin.site.register(Email)
admin.site.register(Roster)
admin.site.register(Profile)
admin.site.register(TestScore)
