from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.show_student_grades, name='show_student_grades'),
    url(r'^simple_chart/$', views.simple_chart, name="simple_chart"),
    url(r'^google_chart/$', views.google_chart),
    url(r'^google_table/$', views.google_table),
    # ex: /5/
    url(r'^student/grades/(?P<student_id>[0-9]+)/$', views.show_student_grades, name='show_student_grades'),
    # ex: /student/attendance/5/
    url(r'^student/attendance/(?P<student_id>[0-9]+)/$', views.show_student_attendance, name='show_student_attendance'),

]
