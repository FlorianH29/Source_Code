from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS

from server.HdMWebAppAdministration import HdMWebAppAdministration
from server.bo.Person import Person
import datetime


app = Flask(__name__)

CORS(app, resources=r'/hdmwebapp/*')

api = Api(app, version='1.0', title='HdMWebAppAPI',
          description='Eine rudimentäre Demo-API für das Buchen von Zeitslots für Projekte.')

banking = api.namespace('hdmwebapp', description='Funktionen der HdMWebApp zur Zeitbuchung.')

# BusinessObject dient als Basisklasse, auf der die weiteren Strukturen Customer, Account und Transaction aufsetzen.
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'),
    'last_edit': fields.DateTime(attribute='_last_edit', description='Der Zeitpunkt der letzten Änderung')
})

person = api.inherit('Person', bo, {
    'firstname': fields.String(attribute='__firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='__lasttname', description='Nachname eines Benutzers'),
    'mailaddress': fields.String(attribute='__mailaddress', description='E-Mail-Adresse eines Benutzers'),
    'username': fields.String(attribute='__username', description='Username eines Benutzers'),
    'firebase_id': fields.String(attribute='__firebase_id', description='Google User ID eines Benutzers')
})


# hier könnt ihr eure Tests reinschreiben, bitte bevor ihr auf den Main-pushed löschen!!!

hwa = HdMWebAppAdministration()

#Test für Update-Befehl
ev1 = hwa.get_event_by_id(1)
wt1 = hwa.get_work_time_account_by_id(1)
hwa.create_event_transaction(ev1, wt1)


# wa1 = hwa.get_work_time_account_by_id(2)
# print(wa1)

# end1 = hwa.create_end_event(1, '20220305', '20220908')
# print(end1)

if __name__ == '__main__':
    app.run(debug=False)

