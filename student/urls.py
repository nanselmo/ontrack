from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.show_student, name='show_student'),
    url(r'^simple_chart/$', views.simple_chart, name="simple_chart"),
    url(r'^google_chart/$', views.google_chart),
    url(r'^google_table/$', views.google_table),
    # ex: /student/5/
    url(r'^(?P<student_id>[0-9]+)/$', views.show_student, name='show_student'),
]
