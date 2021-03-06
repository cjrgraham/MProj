from django.conf.urls import patterns, url
from myrl import views

urlpatterns = patterns('',
        url(r'^play/$', views.index, name='index'),
        url(r'^save_code/$', views.save_code, name='save_code'),
        url(r'^register/$', views.register, name='register'),
        url(r'^logout/$', views.user_logout, name='logout'),
        url(r'^login/$', views.user_login, name='login'),
        url(r'^test/$', views.test, name='test'),
        url(r'^$', views.user_login, name='welcome'),)
