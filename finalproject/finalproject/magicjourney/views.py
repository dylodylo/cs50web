from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .utils import get_all_fields
import json
from .models import User, Player
# Create your views here.


def index(request):
    fields_values = []
    try:
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        fields_values = get_all_fields(player)
    except:
        player = None
    return render(request, "magicjourney/index.html", {"player": player, "fields": fields_values})


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


@login_required
@csrf_exempt
def create_player(request):
    if request.method == "PUT":
        user = User.objects.get(username=request.user.username)
        try:
            Player.objects.get(user=user)
            return JsonResponse({"message": "Player already exists"}, status=202)
        except:
            player = Player.objects.create(user=user)
            player.save()
            return JsonResponse({"message": "Player created"}, status=201)
    else:
        return JsonResponse(status=404)


@login_required
@csrf_exempt
def update_skill(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        skill = data['skill']
        value = data['value']
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        if isinstance(value, int):
            field = player._meta.get_field(skill)
            current_value = getattr(player, skill)
            setattr(player, skill, current_value+value)
            print(current_value, current_value+value)
            player.save()
            print(field)
            return JsonResponse({"value": current_value+value},status=201)

        else:
            setattr(player,skill,value)
            return JsonResponse({"value": value},status=201)