from django.conf.urls import url

from . import views, apis

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<region>[\w-]+)/(?P<data_type>[\w-]+)/$', views.stats_data, name='stats_data'),
    url(r'^resync_data$', apis.resync_data, name='resync_data'),
]
