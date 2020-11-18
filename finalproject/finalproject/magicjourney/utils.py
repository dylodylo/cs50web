
def get_all_fields(object):
    fields = [(f.verbose_name, f.name) for f in object._meta.get_fields()]
    fields_values = []
    for field in fields:
        if field[0] != "ID" and field[0] != "user":       
            value = getattr(object, field[0])
            fields_values.append((field[0], value))
    return fields_values