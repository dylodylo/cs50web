from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    post = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True, blank=True)

