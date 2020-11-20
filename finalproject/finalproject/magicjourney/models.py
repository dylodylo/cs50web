from django.contrib.auth.models import AbstractUser
from django.db import models
# Create your models here.

class User(AbstractUser):
    pass
    
class Player(models.Model):
    blood_choices = [
        ("Muggle", "Muggle"),
        ("Half-blood", "Half-blood"),
        ("Pure-blood", "Pure-blood")
    ]
    houses = [
        ("Gryffindor", "Gryffindor"),
        ("Ravenclaw", "Ravenclaw"),
        ("Hufflepuff", "Hufflepuff"),
        ("Slytherin", "Slytherin")
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    story_status = models.CharField(default="choose_family", max_length=50)
    skills_points = models.IntegerField(default=5)
    xp = models.IntegerField(default = 100)
    level = models.IntegerField(default=0)
    blood = models.CharField(choices=blood_choices, blank=True, max_length=30)
    house = models.CharField(choices=houses, blank=True, max_length=30)
    hp = models.IntegerField(default=0)
    defence = models.IntegerField(default=0)
    charms = models.IntegerField(default=0)
    transfiguration = models.IntegerField(default=0)
    potions = models.IntegerField(default=0)
    charisma = models.IntegerField(default=0)
    money = models.IntegerField(default=0) #in knuts
    