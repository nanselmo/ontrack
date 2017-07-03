from student.models import Student
from student.ontrack import (get_user_homeroom, get_user_info)

# debug
import sys

def always(user_id, user_type, request, view_func, view_args, view_kwargs):
    return True

def never(user_id, user_type, request, view_func, view_args, view_kwargs):
    return False

def if_own_homeroom(user_id, user_type, request, view_func, view_args, view_kwargs):
    target_hr = view_kwargs.get("selected_hr")
    if target_hr is None:
        raise ValueError("No selected_hr named capturing group in URL")
    user_hr = get_user_homeroom(user_id) 
    print >>sys.stdout, "User homeroom: {0}".format(user_hr)
    if target_hr == user_hr:
        return True

def if_own_student(user_id, user_type, request, view_func, view_args, view_kwargs):
    #TODO: implment
    return True


def if_own_id(user_id, user_type, request, view_func, view_args, view_kwargs):
    # TODO: implement
    return True

