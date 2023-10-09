import json

def data_check_string_todict(dcs):
    dcs_dict = {}
    for arg in dcs.split("\n"):
        k,v = arg.split("=", 1)
        dcs_dict[k] = v
        try:
            dcs_dict[k] = json.loads(v)
        except: None

    return dcs_dict

