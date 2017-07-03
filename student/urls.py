from django.conf.urls import url, include
from . import views
from django.conf import settings
from django.conf.urls import handler404
from django.conf.urls.static import static

from student.view_permissions import (always, never, if_own_homeroom, if_own_student, if_own_id)

urlpatterns = [
        url(r'^$', views.homepage, {
            "allow": {
                "School Admin": always,
                "Teacher": always,
                "Student": always,
            }
        }, name='show_home'),
        url(r'logon/', views.logon, {
            "logon_required": False,
            "allow": {
                "School Admin": always,
                "Teacher": always,
                "Student": always,
                "Guest": always
            }
        }),
        url(r'^accounts/', include('allauth.urls'), {
            "logon_required": False,
            "allow": {
                "School Admin": always,
                "Teacher": always,
                "Student": always,
                "Guest": always
            }
        }),
        url(r'^homeroom/All', views.homerooms_all, {
            "allow": {
                "School Admin": always,
                "Teacher": never,
                "Student": never
            }
        }, name='show_hr_all'),
        url(r'^homeroom/(?P<selected_hr>[a-zA-Z0-9]+)$', views.homerooms_single, {
            "allow": {
                "School Admin": always,
                "Teacher": if_own_homeroom,
                #"Student": never
                "Student": if_own_homeroom
            }
        }, name='show_hr'),

        #url(r'^student/dashboard/', views.student_dashboard, name='show_dashboard'),
        url(r'^upload_files/$', views.upload_all_files, {
            "allow": {
                "School Admin": always,
                "Teacher": never,
                "Student": never,
                "Guest": never
            } 
        }),
        url(r'^summerschool/$', views.upload_summer_school, {
            "allow": {
                "School Admin": always,
                "Teacher": never,
                "Student": never,
                "Guest": never
            } 
        }),
        url(r'^staffattend/$', views.teacher_attendance, {
            "allow": {
                "School Admin": always,
                "Teacher": never,
                "Student": never,
                "Guest": never
            } 
        }, name="show_teacher_attendance"),
        url(r'^summerschoolresults/$', views.download_summer_school, {
            "allow": {
                "School Admin": always,
                "Teacher": never,
                "Student": never,
                "Guest": never
            } 
        }, name="download_ss"),
        url(r'^grade_report/$', views.grade_report, {
            "allow": {
                "School Admin": always,
                "Teacher": never,
                "Student": never,
                "Guest": never
            } 
        }),
        url(r'^nwea_summary/(?P<selected_hr>[a-zA-Z0-9]+)$', views.nwea_summary, {
            "allow": {
                "School Admin": always,
                "Teacher": if_own_homeroom,
                "Student": never,
                "Guest": never
            } 
        }, name='show_nwea_summary'),
        url(r'^student/(?P<student_id>[0-9]+)$', views.student_page, {
            "allow": {
                "School Admin": always,
                "Teacher": if_own_student,
                "Student": if_own_id,
                "Guest": never
            } 
        }, name='show_student'),
        url(r'^student/grades/(?P<student_id>[0-9]+)$', views.student_grades, {
            "allow": {
                "School Admin": always,
                "Teacher": if_own_student,
                "Student": if_own_id,
                "Guest": never
            } 
        }, name='show_student_grades'),
        url(r'^student/assignments/(?P<student_id>[0-9]+)/(?P<display_subject>[^/]+)$', views.student_assignments, {
            "allow": {
                "School Admin": always,
                "Teacher": if_own_student,
                "Student": if_own_id,
                "Guest": never
            } 
        }, name='show_student_assignments'),
        url(r'^student/highschool/(?P<student_id>[0-9]+)$', views.hs_options, {
            "allow": {
                "School Admin": always,
                "Teacher": if_own_student,
                "Student": if_own_id,
                "Guest": never
            } 
        }, name='show_hs_options'),
        url(r'^student/attendance/(?P<student_id>[0-9]+)$', views.student_attendance, {
            "allow": {
                "School Admin": always,
                "Teacher": if_own_student,
                "Student": if_own_id,
                "Guest": never
            } 
        }, name='show_student_attendance'),

]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
