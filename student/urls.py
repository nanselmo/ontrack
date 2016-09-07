from django.conf.urls import url, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^$', views.show_home, name='show_home'),

    #for django-allauth
    url(r'^accounts/', include('allauth.urls')),
    url(r'^homeroom', views.show_hr, name='show_hr'),
    url(r'^simple_chart/$', views.simple_chart, name="simple_chart"),
    url(r'^google_chart/$', views.google_chart),
    url(r'^google_table/$', views.google_table),
    # ex: /student/5/
    #url(r'^panel/person/(?P<person_id>[0-9]+)$', 'apps.panel.views.person_form', name='panel_person_form')
    url(r'^student/(?P<student_id>[0-9]+)/$', views.show_student, name='show_student'),
    # ex: student/grades/5/
    url(r'^student/grades/(?P<student_id>[0-9]+)/$', views.show_student_grades, name='show_student_grades'),
    # ex: /student/attendance/5/
    url(r'^student/attendance/(?P<student_id>[0-9]+)/$', views.show_student_attendance, name='show_student_attendance'),
    # ex: /student/ontrack/5/
    url(r'^student/ontrack/(?P<student_id>[0-9]+)/$', views.show_student_ontrack, name='show_student_ontrack'),
    url(r'^student/calculator/(?P<student_id>[0-9]+)/$', views.show_student_calc, name='show_student_calc'),

]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
