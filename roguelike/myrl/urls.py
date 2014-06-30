from django.conf.urls import patterns, url
from myrl import views

urlpatterns = patterns('',
        url(r'^$', views.index, name='index'))
