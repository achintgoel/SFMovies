from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'sfmovies.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', RedirectView.as_view(url='/datasf/home')),
    url(r'^datasf/', include('datasf.urls', namespace="datasf")),
    url(r'^admin/', include(admin.site.urls)),
)
