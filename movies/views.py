import os
import logging
import requests
from bs4 import BeautifulSoup

from django.http import HttpResponse
from django.views.generic import View
from django.conf import settings

from .models import Movie
from .serializers import MovieSerializer
from rest_framework.decorators import action
from rest_framework import viewsets


class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    build`).
    """
    index_file_path = os.path.join(
        settings.REACT_APP_DIR, 'build', 'index.html')

    def get(self, request):
        try:
            with open(self.index_file_path) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead after
                running `yarn start` on the frontend/ directory
                """,
                status=501,
            )


class MovieViewSet(viewsets.ModelViewSet):
    @action(detail=True, url_path='scrape', methods=['get'])
    def scrape(self, request, *args, **kwargs):
        obj = self.get_object()
        if obj.download is None:
            title = obj.title
            year = obj.year
            imdbID = obj.imdbID

            baseUrl = 'https://1337x.to'
            url = f'{baseUrl}/search/{title.replace(" ", "+").lower()}+{year}/1/'
            page = requests.get(url, headers={'User-Agent': ('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                                                             'AppleWebKit/537.36 (KHTML, like Gecko)'
                                                             'Chrome/77.0.3865.90 Safari/537.36'
                                                             )
                                              })

            soup = BeautifulSoup(page.content, 'html.parser')
            rows = soup.find_all('td', class_='coll-1 name')
            keywords = ['BluRay', 'WEBRip', '[YTS] [YIFY]']

            torrents = []

            for r in rows:
                torrent = r.find_all('a')[1]
                for k in keywords:
                    if k in torrent.contents[0] and '1080p' in torrent.contents[0]:
                        torrents.append({
                            'name': torrent.contents[0],
                            'url': f'{baseUrl}{torrent.attrs["href"]}'
                        })
            if len(torrents) > 0:
                Movie.objects.filter(pk=imdbID).update(
                    download=torrents[0]['url'])
                return HttpResponse(torrents[0]['url'], status=200)
            return HttpResponse("No Download Found", status=200)

        return HttpResponse("Download Link Unchanged", status=200)

    queryset = Movie.objects.all().order_by('watched', 'download', 'title')
    serializer_class = MovieSerializer
