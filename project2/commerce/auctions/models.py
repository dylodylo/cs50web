from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    watchlist = models.ManyToManyField('Auction', related_name="watchlist")


class Auction(models.Model):
    name = models.CharField(max_length=50)
    min_price = models.FloatField()
    CATEGORIES = [
        ('Broomsticks', 'Broomsticks'),
        ('Cauldrons', 'Cauldrons')
    ]
    category = models.CharField(max_length=20, choices=CATEGORIES)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_auctions", default=2)
    active = models.BooleanField(default=True)
    image = models.ImageField(default="default.jpg")

    def __str__(self):
        return f"{self.name} for {self.min_price}"


class Bid(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name="bids")
    bid = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_bids", default=2)


class Comment(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name="comments")
    comment = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_comments", default=2)
