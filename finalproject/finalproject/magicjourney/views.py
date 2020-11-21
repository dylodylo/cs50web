from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .utils import get_all_fields, check_level, get_serialized_fields, get_equipment, get_int_fields, get_equipment_values, change_skill
import json
from django.apps import apps
from .models import User, Player, Wand, Robe, Book, Charm
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
    user = User.objects.get(username=username)
    player = Player.objects.get(user=user)
    equipment = get_equipment(player)
    print(equipment)
    fields_values = []
    #try:
    fields_values = get_all_fields(player)
    #except:
        #player = None
    return render(request, "magicjourney/userpage.html", {"player": player, "equipment": equipment, "fields": fields_values})


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
        print("start function",skill,value)
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        if isinstance(value, int):
            field = player._meta.get_field(skill)
            new_value = change_skill(player, skill, value)
            if skill == 'xp':
                check_level(player, value)
            return JsonResponse({"value": new_value},status=201)

        else:
            print(skill,value)
            setattr(player,skill,value)
            player.save()
            return JsonResponse({"value": value},status=201)


@login_required
def get_story_status(request):
    user = User.objects.get(username=request.user.username)
    player = Player.objects.get(user=user)
    status = player.story_status
    return JsonResponse({"status": status}, status=200)


@login_required
@csrf_exempt
def save_story_status(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        function = data['function']
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        player.story_status = function
        player.save()
        return JsonResponse({}, status=201)


@login_required
def get_all_items(request):
    model_name = request.GET.get('model', '')
    model = apps.get_model(User._meta.app_label, model_name, True)
    items = model.objects.all()
    fields = get_serialized_fields(model)
    print([item.getlist() for item in items])
    return JsonResponse([[item.getlist() for item in items], fields], status=200, safe=False)


@login_required
def get_story(request):
    story_name = request.GET.get('function_name', '')
    story_file = open("stories/"+story_name+".txt", "r")
    story = story_file.read()
    return JsonResponse({"story": story}, status=200)


@login_required
@csrf_exempt
def change_equipment(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        category = data['category']
        item_id = data['item']
        model = apps.get_model(User._meta.app_label, category, True)
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        item = model.objects.get(id=item_id)

        current_item = getattr(player, category.lower())
        if current_item != None:
            skills_to_remove = get_equipment_values(current_item)
            #skills_to_remove = [s[1]*(-1) for s in skills_to_remove] #change value of skill from + to -
            for skill in skills_to_remove:
                change_skill(player, skill[0], -skill[1])
        setattr(player, category.lower(), item)
        skills = get_equipment_values(item)
        for skill in skills:
            change_skill(player, skill[0], skill[1])
        return JsonResponse({"item": item.__str__(), "skills": skills}, status=201)


@login_required
@csrf_exempt
def buy_item(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        item_id = data['item_id']
        model_name = data['model_name']
        model = apps.get_model(User._meta.app_label, model_name, True)
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        item = model.objects.get(id=item_id)

        if player in item.players.all():
            return JsonResponse({"message": "You already have this!"}, status=304)
        if player.money < item.price_knuts:
            return JsonResponse({"message": "You don't have enough money!"}, status=304)
        else:
            item.players.add(player)
            change_skill(player, 'money', -item.price_knuts)
            #add story based on bought item category
            return JsonResponse({"money": player.money_in_galleons(), "story":"story"}, status=201)

@login_required
@csrf_exempt
def unequip(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        item_name = data['item']
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        item = getattr(player, item_name)
        print(item)
        setattr(player, item_name, None)
        player.save()
        skills = get_equipment_values(item)
        for skill in skills:
            change_skill(player, skill[0], -skill[1])
        return JsonResponse({}, status=201)