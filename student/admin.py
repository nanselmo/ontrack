from django.contrib import admin
from .models import Student,Grade,Subject, Attendance


# Register your models here.
admin.site.register(Student)
admin.site.register(Grade)
admin.site.register(Subject)
admin.site.register(Attendance)
