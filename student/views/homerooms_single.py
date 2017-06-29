import json
from django.shortcuts import render 
from student.ontrack import get_grade_distribution
from student.blended_learning import (get_all_jiji_json, get_last_two_jiji)
from student.classdata import hr_data

def homerooms_single(request, selected_hr=None):
    if selected_hr == None:
        render("error.html", {"error_message": "No homeroom selected!"})
    
    hr_json, hr_dict = hr_data(selected_hr, admin=False)
    title = "{0} Students".format(selected_hr)
    grade_distribution_array, avg_grades_list = get_grade_distribution(selected_hr)
    all_stmath_gviz_json = get_all_jiji_json(selected_hr)
    last_two_stdates_data_json = get_last_two_jiji(selected_hr)

    return render(request, "student/homeroom.html", {
        "hr_dict": hr_dict,
        "hr_json": hr_json,
        "title": title,
        "grade_distribution_array": json.dumps(grade_distribution_array),
        "avg_grades": json.dumps(avg_grades_list),
        "all_stmath_gviz_json": all_stmath_gviz_json,
        "stmath_dates_json": last_two_stdates_data_json
    })
    
