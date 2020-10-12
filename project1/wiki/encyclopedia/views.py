from django.shortcuts import render, redirect
from django import forms
from django.http import HttpResponseRedirect
import random
from markdown2 import Markdown

from . import util

class NewPage(forms.Form):
    title = forms.CharField(label="Title")
    content = forms.CharField(widget=forms.Textarea(attrs={"cols":10}))


class EditPage(forms.Form):
    title = forms.CharField(widget=forms.HiddenInput())
    content = forms.CharField(widget=forms.Textarea())


markdowner = Markdown()


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, name):
    entries = util.list_entries()
    if name not in entries:
        return render(request, "encyclopedia/entry.html",{"content": "Sorry, we can't find that site.", "title": name})
    if request.method == "POST":
        name = request.POST.get('q')
        return render(request, "encyclopedia/entry.html",{"content": markdowner.convert(util.get_entry(name)), "title": name})
    return render(request, "encyclopedia/entry.html",{"content": markdowner.convert(util.get_entry(name)), "title": name})


def search(request):
    entries = util.list_entries()
    if request.method == "POST":
        name = request.POST.get('q')
        if name in entries:
            return redirect("wiki/"+str(name))
        else:
            searched_entries = []
            for entry in entries:
                if entry.startswith(name):
                    searched_entries.append(entry)
            
            return render(request, "encyclopedia/search.html", {"entries": searched_entries, "name": name})


def new(request):
    entries = util.list_entries()
    if request.method == "POST":
        form = NewPage(request.POST)
        if form.is_valid():
            title = form.cleaned_data['title']
            if title in entries:
                return render(request, "encyclopedia/error.html")
            else:
                content = form.cleaned_data['content']
                util.save_entry(title, content)
                entries = util.list_entries()
                return redirect("wiki/"+title)
    else:
        return render(request, "encyclopedia/new.html", {"form": NewPage()})


def edit(request, name):
    if request.method == "POST":
        form = EditPage(request.POST)
        if form.is_valid():
            content = form.cleaned_data['content']
            util.save_entry(name, content)
            return render(request, "encyclopedia/entry.html",{"content": markdowner.convert(util.get_entry(name)), "title": name})


        else:
            return render(request, "encyclopedia/error.html")

    if request.method == "GET":
        content = util.get_entry(name)
        form = EditPage(initial={"content": content, "title": name})
        return render(request, "encyclopedia/edit.html", {"form": form, "name": name})


def randompage(request):
    entries = util.list_entries()
    rand = random.randint(0,len(entries)-1)
    name = entries[rand]
    return render(request, "encyclopedia/entry.html",{"content": markdowner.convert(util.get_entry(name)), "title": name})


