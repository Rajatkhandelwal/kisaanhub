from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, HttpResponseForbidden,HttpResponseNotFound
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.template import RequestContext, loader, Template
from stats.models import *
from django.core.serializers.json import DjangoJSONEncoder

import requests
import json
import os

# view for index.html with regions and data types
def index(request):
    try:
        template = loader.get_template("index.html")
        params = {
          "region_image": settings.REGION_IMAGE,
          "data_type": settings.DATA_TYPE
        }
        context = RequestContext(request, params)
        return HttpResponse(template.render(context))
    except ObjectDoesNotExist:
        return HttpResponseNotFound(loader.get_template("404.html").render(RequestContext(request,{})))

# view for stats.html accepting region and data type as request params
def stats_data(request, region, data_type):
    try:
        if(region not in settings.REGION_TYPE):
          return HttpResponseNotFound(loader.get_template("404.html").render(RequestContext(request,{})))
        if(data_type not in settings.REGION_TYPE[region]):
          return HttpResponseNotFound(loader.get_template("404.html").render(RequestContext(request,{})))

        template = loader.get_template("stats.html")

        d = Data.objects.values().filter(data_type=data_type, country=region)
        data = json.dumps(list(d), cls=DjangoJSONEncoder)

        params = {
            "regions": settings.REGION,
            "data_type": settings.DATA_TYPE,
            "title": "This is title",
            "active_region": region,
            "active_data_type": data_type.replace('_', ' '),
            "stats": data
        }
        context = RequestContext(request, params)
        return HttpResponse(template.render(context))
    except ObjectDoesNotExist:
        return HttpResponseNotFound(loader.get_template("404.html").render(RequestContext(request,{})))
