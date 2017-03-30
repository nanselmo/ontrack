from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
#import User from Django's built-in auth
from django.contrib.auth.models import User

#to use to create new Profile instance every time a User is created
from django.db.models.signals import post_save
from django.dispatch import receiver

#import map_fields
from django_google_maps import fields as map_fields

# Create your models here.

class Student(models.Model):
    student_id = models.CharField(max_length=40, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=2)
    birthdate = models.DateField(null=True)

    def __str__(self):
        return self.student_id + ": " + self.first_name + " " + self.last_name

#teachers will have their username as ID, students have their 8 digit id
class Email(models.Model):
    student_id = models.CharField(max_length=40, primary_key=True)
    email = models.CharField(max_length=100)
    user_type = models.CharField(max_length=100, null=True)


    def __str__(self):
        return self.student_id + " " + self.email

class Roster(models.Model):
    student_id = models.CharField(max_length=40, primary_key=True)
    hr_id = models.CharField(max_length=2)
    grade_level = models.CharField(max_length=2)

    def __str__(self):
        return self.student_id + " HR: " + self.hr_id + " GR: " + self.grade_level

class Homeroom(models.Model):
    hr_id = models.CharField(max_length=20, primary_key=True)
    hr_name= models.CharField(max_length=40)
    teacher_id = models.CharField(max_length=2)

    def __str__(self):
        return self.hr_id + " hr_name: " + self.hr_name + " teacher_id: " + self.teacher_id

# class Teacher(models.Model):
#     teacher_id = models.CharField(max_length=20, primary_key=True)
#     teacher_email= models.CharField(max_length=100)
#     teacher_first_name = models.CharField(max_length=80)
#     teacher_last_name = models.CharField(max_length=80)
#
#     def __str__(self):
#         return self.hr_id + " hr_name: " + self.hr_name + " teacher_id: " + self.teacher_id

class Subject(models.Model):
    subject_id=models.IntegerField(primary_key=True)
    subject_name = models.CharField(max_length=60)
    display_name = models.CharField(max_length=60, null=True)
    image = models.ImageField('Subject Icon', upload_to='images/subj_icons')

    def __str__(self):
        return "{0}: {1}".format(self.subject_id, self.subject_name)

class SubjectInfo(models.Model):
    subject_name = models.CharField(max_length=60)
    display_name = models.CharField(max_length=60, null=True)
    image = models.ImageField('Subject Icon', upload_to='images/subj_icons')

    def __str__(self):
        return "{0}: {1}".format(self.subject_id, self.subject_name)

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.CharField(max_length=60)
    grade = models.IntegerField()
    quarter_grade = models.IntegerField(null=True)
    grade_date = models.DateField(default=timezone.now)
    created = models.DateField(auto_now_add=True)


    def __str__(self):
        return "{0}: {1}".format(self.subject, self.grade_date)

class Assignment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.CharField(max_length=60)
    assign_name = models.CharField(max_length=300)
    assign_score = models.CharField(max_length=4)
    assign_score_possible = models.CharField(max_length=4)
    category_name = models.CharField(max_length=300)
    assignment_due = models.DateField()
    grade_entered = models.DateField()
    created = models.DateField(auto_now_add=True)


    def __str__(self):
        return "{0}: {1} - {2}/{3}".format(self.student, self.assign_name, self.assign_score, self.assign_score_possible)

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

class Profile(models.Model):
    user = models.OneToOneField(Email, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=60, default="Student")

class TestScore(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE,  db_constraint=False)
    test_name = models.CharField(max_length=60)
    score = models.CharField(max_length=5)
    percentile = models.CharField(max_length=3, null=True)
    test_session = models.CharField(max_length=60, null=True)
    subject = models.CharField(max_length=60, null=True)

    def __str__(self):
        return "{0}: {1} - {2} - {3}".format(self.student, self.test_name, self.test_session, self.subject)


class HighSchool(models.Model):
    short_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=400, null=True, blank=True)
    website = models.CharField(max_length=500, null=True, blank=True)
    logo = models.ImageField('HS Logo', upload_to='images/hs_icons')
    school_type = models.CharField(max_length=50, null=True)
    tier1_points =  models.IntegerField(null=True, blank=True)
    tier2_points =  models.IntegerField(null=True, blank=True)
    tier3_points =  models.IntegerField(null=True, blank=True)
    tier4_points =  models.IntegerField(null=True, blank=True)
    address = map_fields.AddressField(max_length=200, null=True, blank=True)
    geolocation = map_fields.GeoLocationField(max_length=100, null=True, blank=True)


class DataFile(models.Model):
    document = models.FileField(upload_to='documents/')
    file_type = models.CharField(max_length=100, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def filename(self):
        return (self.document.name)

    def fileurl(self):
        return (self.document.url)

    def __str__(self):
        return "{0}".format(self.document)
