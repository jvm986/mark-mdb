from rest_framework import serializers
from .models import Movie


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('imdbID', 'title', 'year', 'poster', 'download',
                  'watched', 'created_at', 'watched_on')
