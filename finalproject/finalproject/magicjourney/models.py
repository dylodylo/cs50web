from django.contrib.auth.models import AbstractUser
from django.db import models
# Create your models here.

class User(AbstractUser):
    pass
    
class Player(models.Model):
    blood_choices = [
        ("muggle", "Muggle"),
        ("half-blood", "Half-blood"),
        ("pure-blood", "Pure-blood")
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.IntegerField(default=0)
    blood = models.CharField(choices=blood_choices, blank=True, max_length=30)
    hp = models.IntegerField(default=0)
    defence = models.IntegerField(default=0)
    charms = models.IntegerField(default=0)
    transmutation = models.IntegerField(default=0)
    potions = models.IntegerField(default=0)
    charisma = models.IntegerField(default=0)
    money = models.IntegerField(default=0) #in knuts
    