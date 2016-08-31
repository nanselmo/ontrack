from django.conf.urls import url
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^$', views.show_student_grades, name='show_student_grades'),
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

]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
