from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

from .models import User, Auction


class NewAuction(forms.Form):
    name = forms.CharField(label="Auction name", max_length=50)
    min_price = forms.FloatField(min_value=1)
    description = forms.CharField(widget=forms.Textarea)
    category = forms.ChoiceField(choices=Auction.CATEGORIES)


def index(request):
    auctions = Auction.objects.all()
    return render(request, "auctions/index.html",{"auctions":auctions})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


def auction(request, auction_id):
    auction = Auction.objects.get(pk=auction_id)
    return render(request, "auctions/auction.html", {"auction":auction})


def new(request):
    if request.method == "POST":
        name = request.POST['name']
        min_price = request.POST['min_price']
        category = request.POST['category']
        description = request.POST['description']
        try:
            new_auction = Auction(name=name, min_price=min_price, category=category, description=description)
            new_auction.save()
        except IntegrityError:
            return render(request, "auctions/new.html", {"message": "Some error"})
        return HttpResponseRedirect(reverse("auction", args={Auction.objects.last().pk}))
    return render(request, "auctions/new.html", {"form":NewAuction()})