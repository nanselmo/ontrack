from student.models import  Email
from allauth.socialaccount.models import SocialAccount
from django.db import connection
import math


#variables
gpa_subjects_list = ['Math', 'Science', 'Social Studies', 'ELA']


#functions
def get_user_id(da_request, admin_student_id="1"):
    try:
        social_email=SocialAccount.objects.get(user=da_request.user).extra_data['email']
        lookup_user_id=Email.objects.get(email=social_email).student_id
    except:
        #add if statement to see if user is teacher/admin before returning the student data
            lookup_user_id = admin_student_id
    return lookup_user_id

def getOnTrack(att, gpa):
    if gpa>=3:
        if att>=95:
            onTrack=5
        elif att>=90:
            onTrack=4
        else:
            onTrack=3
    elif gpa>=2:
        if att>=98:
            onTrack=4
        elif att>=90:
            onTrack=3
        else:
            onTrack=2
    elif gpa>=1:
        if att>=98:
            onTrack=3
        elif att>=80:
            onTrack=2
        else:
            onTrack=1
    else:
        if att>=90:
            onTrack=2
        else:
            onTrack=1
    return onTrack



def getPoints(x):
# if no grade for that subject at that date
    if math.isnan(x):
        # just return it untouched
        return x
    # but, if not, return the points
    elif x:
        if x>=90:
            return 4
        elif x>=80:
            return 3
        elif x>=70:
            return 2
        elif x>=60:
            return 1
        else:
            return 0
    # and leave everything else
    else:
        return
