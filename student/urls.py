from django.conf.urls import url, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^$', views.show_home, name='show_home'),
    #for django-allauth
    url(r'^accounts/', include('allauth.urls')),
    url(r'^homeroom', views.show_hr, name='show_hr'),
    url(r'^student/dashboard/', views.show_dashboard, name='show_dashboard'),
    url(r'^simple_chart/$', views.simple_chart, name="simple_chart"),
    url(r'^google_chart/$', views.google_chart),
    url(r'^google_table/$', views.google_table),
    url(r'^student/$', views.show_student, name='show_student'),
    url(r'^student/grades/$', views.show_student_grades, name='show_student_grades'),
    url(r'^student/attendance/$', views.show_student_attendance, name='show_student_attendance'),
    url(r'^student/ontrack/$', views.show_student_ontrack, name='show_student_ontrack'),
    url(r'^student/calculator/$', views.show_student_calc, name='show_student_calc'),

]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
