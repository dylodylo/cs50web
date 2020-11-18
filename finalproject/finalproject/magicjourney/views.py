from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout

from .models import User
# Create your views here.


def index(request):
    return render(request, "magicjourney/index.html")


def register(request):
    if request.method == "POST":
        username = request.POST['login']
        password = request.POST['password']
        email = request.POST['email']
        confirmation = request.POST['confirmation']
        if password != confirmation:
            return render(request, "magicjourney/register.html", {"message": "Passwords must match."})
        
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "magicjourney/register.html", {"message": "Username already taken."})

        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "magicjourney/register.html")


def userpage(request, username):
    user_ = User.objects.get(username=username)
    return render(request, "magicjourney/userpage.html", {"my_user": user_})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "magicjourney/login.html", {"message": "Invalide username and/or password."})
    else:
        return render(request, "magicjourney/login.html")