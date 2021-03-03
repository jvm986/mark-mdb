from django.db import models


class Movie(models.Model):
    imdbID = models.CharField(max_length=10, unique=True, primary_key=True)
    title = models.CharField(max_length=100)
    year = models.IntegerField()
    poster = models.URLField()
    download = models.URLField(null=True)
    watched = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    watched_on = models.DateField(null=True)
