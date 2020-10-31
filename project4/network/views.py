from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.core.paginator import Paginator
import datetime
from django.http import JsonResponse
import json

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from .models import User, Post

class NewPost(forms.Form):
    post = forms.CharField(widget=forms.Textarea)

def index(request):
    if request.method == "POST":
        newpostform = NewPost(request.POST)
        if newpostform.is_valid():
            post = request.POST["post"]
            new_post = Post(post=post, user=request.user, likes=0)
            new_post.save()
        else:
            newpostbody = request.POST.get("editedpost", False)
            post_id = request.POST.get("postid", False)
            print(post_id)
            print(newpostbody)

    page = request.GET.get('page', 1)
    posts_list = Post.objects.all().order_by("-id")
    paginator = Paginator(posts_list, 10)
    return render(request, "network/index.html", {"posts": paginator.page(page), "form": NewPost()})


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def user(request, username):
    user = User.objects.get(username=username)
    if request.method == "POST":
        follower = request.user
        if follower in user.followers.all():
            user.followers.remove(follower)
            follower.following.remove(user)
        else:
            user.followers.add(follower)
            follower.following.add(user)
        user.save()
    page = request.GET.get('page', 1)
    posts_list = Post.objects.filter(user=user).order_by("-id")
    paginator = Paginator(posts_list, 10)
    return render(request, "network/user.html", {"username":username, "posts":paginator.page(page), "followers": user.followers.count(), "following_count": user.following.count(), "following": user.followers.all(), "user":request.user})


def following(request):
    user = User.objects.get(username=request.user.username)
    if len(user.following.all()) == 0:
        return render(request, "network/index.html", {"posts": [], "form": NewPost()})  
    else:
        page = request.GET.get('page', 1)
        posts_list = Post.objects.filter(user__in = user.following.all()).order_by("-id")
        paginator = Paginator(posts_list, 10)
        return render(request, "network/index.html", {"posts": paginator.page(page), "form": NewPost()})



@login_required
@csrf_exempt
def editpost(request):
    print(request.method)
    if request.method == "PUT":
        data = json.loads(request.body)
        post_id = data["id"]
        new_post = data["new_post"]
        print(post_id)
        print(new_post)
        try:
            post = Post.objects.get(pk=int(post_id))
            if post.user == request.user:
                post.post = new_post
                post.save()
                print(post)
                print(post.user)
                print(request.user)
                return JsonResponse({"message": "no error"}, status=201)

            else: 
                return JsonResponse({"message": "error"}, status=404)
        except:
            return JsonResponse({"message": "error"}, status=404)

    else:
        return JsonResponse({"message": "error"}, status=400)
