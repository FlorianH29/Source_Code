from flask import request
from google.auth.transport import requests
import google.oauth2.id_token


class Helper(object):

    def __init__(self):
        pass

    def get_firebase_id(self):

        firebase_request_adapter = requests.Request()
        id_token = request.cookies.get("token")

        claims = google.oauth2.id_token.verify_firebase_token(id_token, firebase_request_adapter)

        if claims is not None:
            firebase_id = claims.get("user_id")

            return firebase_id
