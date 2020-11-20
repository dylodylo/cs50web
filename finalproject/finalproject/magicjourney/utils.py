
def get_all_fields(object):
    no_fields = ["id", "user", "story_status"]
    fields = [(f.verbose_name, f.name) for f in object._meta.get_fields()]
    fields_values = []
    for field in fields:
        if field[1] not in no_fields:       
            value = getattr(object, field[1])
            fields_values.append((field[0], value))
    return fields_values


def check_level(player, value):
    if player.level*100 <= player.xp + value:
        player.level += 1
        player.skills_points += player.level
        player.hp += 10
