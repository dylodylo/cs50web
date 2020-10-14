from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required
from django.forms import ModelForm

from .models import User, Auction, Bid, Comment



class AuctionForm(ModelForm):
    class Meta:
        model = Auction
        fields = ['name', 'min_price', 'description', 'category', 'image']


class MakeBid(forms.Form):
    bid = forms.FloatField()

class NewComment(forms.Form):
    comment = forms.CharField(widget=forms.Textarea, max_length=255)


def index(request):
    auctions = Auction.objects.filter(active=True)
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
    comments = Comment.objects.filter(auction=auction)
    user = request.user
    if request.method == "POST":
        
        if "makebid" in request.POST:
            bid = int(request.POST["bid"])           
            new_bid = Bid(user=user, auction=auction, bid=bid)
            if bid > auction.min_price:
                #change min_price to bid
                auction.min_price = bid
                auction.save()
                Bid.objects.filter(auction=auction).delete()
                new_bid.save()
            else:
                return render(request, "auctions/auction.html", 
                    {"auction":auction, "bid_form":MakeBid(), "message": "Your offer is too low", "comments":comments, "comment_form":NewComment()})
        if "addcomment" in request.POST:
            comment = request.POST["comment"]
            new_comment = Comment(user=user, auction=auction, comment=comment)
            new_comment.save()
            return render(request, "auctions/auction.html", 
                    {"auction":auction, "bid_form":MakeBid(), "message": "Your offer is too low", "comments":comments, "comment_form":NewComment()})
    
    if auction.active:
        return render(request, "auctions/auction.html", {"auction":auction, "bid_form":MakeBid(), "comments":comments, "comment_form":NewComment()})
    else:
        bid = Bid.objects.get(auction=auction)
        return render(request, "auctions/auction.html", {"auction":auction, "winner": bid.user, "comments":comments, "comment_form":NewComment()})


def new(request):
    if request.method == "POST":
        form = AuctionForm(request.POST, request.FILES)
        try:
            form.save()
        except IntegrityError:
            return render(request, "auctions/new.html", {"message": "Some error"})
        return HttpResponseRedirect(reverse("auction", args={Auction.objects.last().pk}))
    return render(request, "auctions/new.html", {"form":AuctionForm()})


@login_required
def watchlist(request, user_id):
    user = request.user
    auctions = user.watchlist.all()
    return render(request, "auctions/watchlist.html", {"auctions": auctions})


def end_auction(request, auction_id):
    auction = Auction.objects.get(pk=auction_id)
    auction.active = False
    auction.save()
    return redirect(index)


def add(request, auction_id):
    user = request.user
    user.watchlist.add(Auction.objects.get(pk=auction_id))
    user.save()
    return HttpResponseRedirect(reverse('auction', args=(auction_id,)))


def delete(request, auction_id):
    user = request.user
    auction = Auction.objects.get(pk=auction_id)
    user.watchlist.remove(auction)
    user.save()
    return HttpResponseRedirect(reverse('auction', args=(auction_id,)))


def categories(request):
    categories = Auction.CATEGORIES
    return render(request, "auctions/categories.html", {"categories":categories})


def category(request, category_name):
    auctions = Auction.objects.filter(category=category_name, active=True)
    return render (request, "auctions/category.html", {"auctions": auctions, "category": category_name})