from django.conf.urls import patterns, url
from myrl import views

urlpatterns = patterns('',
        url(r'^play/$', views.index, name='index'),
        url(r'^register/$', views.register, name='register'),
        url(r'^logout/$', views.user_logout, name='logout'),
        url(r'^$', views.user_login, name='welcome'),)
