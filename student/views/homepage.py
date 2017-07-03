from django.shortcuts import render
from django.http import HttpResponseRedirect
from student.models import Roster, Student
from student.ontrack import (get_user_homeroom, get_user_info)

# varies depending on user's homerooms and 
#   whether or not they're an admin
def homepage(request):
    user_id, user_type = get_user_info(request)
    if user_type == "School Admin":
        return homepage_all_rooms(request)
    elif user_type == "Teacher":
        return homepage_teacher(request, user_id)
    else:
        return homepage_student(request, user_id)

def homepage_all_rooms(request):
    hr_dict = Roster.objects.values('hr_id','grade_level').distinct().order_by('grade_level')
    prev_grade=0
    display_hr_list=[]

    for hr in hr_dict:
        valid_grade_level = hr['grade_level'] not in ["20","PE","PK"]
        valid_homeroom = hr['hr_id'] not in ["1","2"]
        if valid_grade_level & valid_homeroom:

            cur_grade = "GR: " + hr['grade_level']
            if (cur_grade != prev_grade):
                display_hr_list.append(cur_grade)

            display_hr_list.append(hr['hr_id'])
            prev_grade = cur_grade

    return render(request, "student/home.html", {"display_hr_list": display_hr_list})


def homepage_teacher(request, student_id):
    homeroom = get_user_homeroom(student_id)
    return HttpResponseRedirect("/homerooms/{0}".format(homeroom))

def homepage_student(request, student_id):
    return HttpResponseRedirect("/student/{0}".format(student_id))
