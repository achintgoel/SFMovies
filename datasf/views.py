# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext
import json

from datasf_api import search

def get_datasf_movies(request):
    search_params = {}
    data = search('data.sfgov.org/resource/', 'yitu-d5am.json', search_params)
    #get unique set of film titles from data returned from datasf (for autocomplete search)
    film_titles_set = set(map(lambda x: x['title'], data))
    film_titles_list = list(film_titles_set)

    #convert list of film data into dictionary with key being film title
    films_data = {}
    for film in data:
        if not films_data.has_key(film['title']):
            films_data[film['title']] = []
        films_data[film['title']].append(film)

    response = json.dumps({'films_data':films_data, 'film_titles_list':film_titles_list})

    return HttpResponse(response,
                        content_type='application/javascript; charset=utf-8')


def home(request):
    return render_to_response('datasf/home.html', locals(), context_instance=RequestContext(request))