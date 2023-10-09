import urllib.parse
import hmac
import hashlib
import json

def parse_validate_init_data(init_data: str):
    parsed_data = parse_init_data(init_data)
    dcs = init_data_to_dcs(init_data)
    BOT_TOKEN = "6457589571:AAFjAPcwUrrySkEVzaWsbszMn3zdjSqI-IY"
    secret_key = hmac.digest(
        key=b"WebAppData",
        msg=BOT_TOKEN.encode(),
        digest=hashlib.sha256
    )
    mac = hmac.new(
        key=secret_key,
        digestmod=hashlib.sha256
    )
    mac.update(dcs.encode())
    return hmac.compare_digest(mac.hexdigest(), parsed_data["hash"]), parsed_data

def parse_init_data(init_data: str) -> dict:
    init_data_parsed = urllib.parse.parse_qs(init_data)
    res = {}
    for k, v in init_data_parsed.items():
        try:
            v = json.loads(v[0])
            res[k] = v
        except:
            res[k] = v[0]

    return res

def init_data_to_dcs(init_data: str) -> str:
    init_data_parsed = urllib.parse.parse_qs(init_data)
    res = []
    for k, v in sorted(init_data_parsed.items(), key=lambda x: x[0]):
        if k != "hash":
            res.append("=".join((k, v[0])))

    return "\n".join(res)


