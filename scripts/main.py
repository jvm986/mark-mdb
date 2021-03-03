import requests
from bs4 import BeautifulSoup
import json


def scrape(title, year=None):
    ''' Returns a list of "Title: URL" dictionaries

    Errors will result in empty list'''
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
                    torrent.contents[0]: f'{baseUrl}{torrent.attrs["href"]}'
                })

    return torrents


def omdb(title, year=None):
    ''' Returns a single dictionary from API

    Errors will be returned as dict'''
    baseUrl = 'http://www.omdbapi.com/?apikey=925782bd&'
    url = f'{baseUrl}t={title.replace(" ", "+").lower()}{"&y=" + str(year) if year else ""}'
    page = requests.get(url, headers={'User-Agent': ('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                                                     'AppleWebKit/537.36 (KHTML, like Gecko)'
                                                     'Chrome/77.0.3865.90 Safari/537.36'
                                                     )
                                      })

    return json.loads(page.text)


def getMovies():
    response = requests.get('http://127.0.0.1:8000/api/movies/')
    return json.loads(response.text)


def scrapeMovie(imdbID):
    response = requests.get(
        f'http://127.0.0.1:8000/api/movies/{imdbID}/scrape/')
    return response.text


def sendMessage(message):
    response = requests.get(
        f'https://api.telegram.org/bot1234316268:AAHj_oBQPgd_Hc21dbMNKMZm-K_qFqfTSqk/sendMessage?chat_id=1003766735&parse_mode=Markdown&text={message}',)
    return response.text


movies = getMovies()
for movie in movies:
    if movie['download'] is None:
        result = scrapeMovie(movie['imdbID'])
        if result != 'No Download Found':
            sendMessage(
                f'Yo, [{movie["title"]}]({result}) is ready to download. You know what to do lol.')
