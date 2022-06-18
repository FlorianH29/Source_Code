from flask import request
from google.auth.transport import requests
import google.oauth2.id_token

from server.HdMWebAppAdministration import HdMWebAppAdministration


def secured(function):
    """Decorator zur Google Firebase-basierten Authentifizierung von Benutzern

    Da es sich bei diesem System um eine basale Fallstudie zu Lehrzwecken handelt, wurde hier
    bewusst auf ein ausgefeiltes Berechtigungskonzept verzichtet. Vielmehr soll dieses Decorator
    einen Weg aufzeigen, wie man technisch mit vertretbarem Aufwand in eine Authentifizierung
    einsteigen kann.

    POLICY: Die hier demonstrierte Policy ist, dass jeder, der einen durch Firebase akzeptierten
    Account besitzt, sich an diesem System anmelden kann. Bei jeder Anmeldung werden Klarname,
    Mail-Adresse sowie die Google User ID in unserem System gespeichert bzw. geupdated. Auf diese
    Weise könnte dann für eine Erweiterung des Systems auf jene Daten zurückgegriffen werden.
    """
    firebase_request_adapter = requests.Request()

    def wrapper(*args, **kwargs):
        # Verify Firebase auth.
        id_token = request.cookies.get("token")
        error_message = None
        claims = None
        objects = None

        if id_token:
            try:
                # Verify the token against the Firebase Auth API. This example
                # verifies the token on each page load. For improved performance,
                # some applications may wish to cache results in an encrypted
                # session store (see for instance
                # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
                claims = google.oauth2.id_token.verify_firebase_token(
                    id_token, firebase_request_adapter)

                if claims is not None:
                    hwa = HdMWebAppAdministration()

                    firstname ='Vorname noch nachtragen'
                    lastname = 'Nachname noch nachtragen'
                    username = claims.get("name")
                    mailaddress = claims.get("email")
                    firebase_id = claims.get("user_id")

                    person = hwa.get_person_by_firebase_id(firebase_id)
                    if person is not None:
                        """ Wenn der Benutzer bereits im System hinterlegt ist, kann es sein
                            dass der Username und die Mailadresse sich ändert. Aus diesem 
                            Grund wird hier der Usanme und die Mailadresse geupdatet."""
                        person.set_mailaddress(mailaddress)
                        hwa.save_person(person)
                    else:
                        """Wenn der Benutzer noch nicht im System angelegt, wird dieser hier mit der Create 
                            Methode generiert."""
                        person = hwa.create_person(firstname, lastname, mailaddress, firebase_id)

                    print(request.method, request.path, "angefragt durch:",  mailaddress, firebase_id)

                    objects = function(*args, **kwargs)
                    return objects
                else:
                    return '', 401  # UNAUTHORIZED !!!
            except ValueError as exc:
                # This will be raised if the token is expired or any other
                # verification checks fail.
                error_message = str(exc)
                return exc, 401  # UNAUTHORIZED !!!

        return '', 401  # UNAUTHORIZED !!!

    return wrapper