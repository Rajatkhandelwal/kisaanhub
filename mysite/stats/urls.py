from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<country>[\w-]+)/(?P<data_type>[\w-]+)/$', views.stats_data, name='stats_data'),
]
