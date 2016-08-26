from __future__ import unicode_literals

from django.db import models
from django.utils import timezone

# Create your models here.

class Student(models.Model):
    student_id = models.CharField(max_length=20, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    def __str__(self):
        return self.first_name + " " + self.last_name

class Subject(models.Model):
    subject_id=models.IntegerField(primary_key=True)
    subject_name = models.CharField(max_length=60)
    image = models.ImageField('Subject Icon', upload_to='static/images/subj_icons')

    def __str__(self):
        return "{0}: {1}".format(self.subject_id, self.subject_name)

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    grade = models.IntegerField()
    grade_date = models.DateField(default=timezone.now)
    created = models.DateField(auto_now_add=True)


    def __str__(self):
        return "{0}: {1}, {2}".format(self.student, self.subject, self.grade_date)

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    total_days = models.DecimalField(max_digits=4, decimal_places=1)
    absent_days = models.DecimalField(max_digits=4, decimal_places=2)
    attend_date = models.DateField(default=timezone.now)
    created = models.DateField(auto_now_add=True)

    def calc_pct(self):
        return 100*(self.total_days-self.absent_days)/self.total_days

    def __str__(self):
        return "{0}: {1}/{2}".format(self.student, self.absent_days, self.total_days)
