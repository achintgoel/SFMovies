from django.conf.urls import patterns, url
from datasf import views
urlpatterns = patterns('',
    url(r'^home/$', views.home , name='home'),
    url(r'^get_datasf_movies/$', views.get_datasf_movies , name='get_datasf_movies'),
)

