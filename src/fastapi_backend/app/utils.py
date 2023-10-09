import urllib.parse

def init_data_to_dcs(init_data: str):
    init_data_parsed = urllib.parse.parse_qs(init_data)
    res = []
    for k, v in sorted(init_data_parsed.items(), key=lambda x: x[0]):
        if k != "hash":
            res.append("=".join((k, v[0])))

    return "\n".join(res)

