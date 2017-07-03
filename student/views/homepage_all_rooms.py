from django.shortcuts import render
from student.models import Roster

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

