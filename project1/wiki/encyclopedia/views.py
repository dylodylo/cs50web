from django.shortcuts import render, redirect

from . import util

entries = util.list_entries()

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, name):
    if name not in entries:
        return render(request, "encyclopedia/entry.html",{"content": "Sorry, we can't find that site.", "title": name})
    if request.method == "POST":
        name = request.POST.get('q')
        return render(request, "encyclopedia/entry.html",{"content": util.get_entry(name), "title": name})
    return render(request, "encyclopedia/entry.html",{"content": util.get_entry(name), "title": name})


def search(request):
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
