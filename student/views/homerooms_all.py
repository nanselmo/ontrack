import json
from django.shortcuts import render 
from student.ontrack import get_grade_distribution
from student.blended_learning import (get_all_jiji_json, get_last_two_jiji)
from student.classdata import hr_data

def homerooms_all(request, selected_hr=None):
    
    if selected_hr == None:
        render("error.html", {"error_message": "No homeroom selected!"})
    hr_json, hr_dict = hr_data("All", admin=True)
    title = "All Students"
    _, avg_grades_list = get_grade_distribution("All")
    #don't draw pie graphs for All
    grade_distribution_array = []
    all_stmath_gviz_json = get_all_jiji_json("all")
    last_two_stdates_data_json = get_last_two_jiji("all")

    return render(request, "student/homeroom.html", {
        "hr_dict": hr_dict,
        "hr_json": hr_json,
        "title": title,
        "grade_distribution_array": json.dumps(grade_distribution_array),
        "avg_grades": json.dumps(avg_grades_list),
        "all_stmath_gviz_json": all_stmath_gviz_json,
        "stmath_dates_json": last_two_stdates_data_json
    })
    
