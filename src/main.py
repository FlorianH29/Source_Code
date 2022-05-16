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
#hwa.create_person(1,'20220505', 'Anders', 'Wurst', 'h.wurst', 'hw@gmx.lol', 1)
#ee1 = hwa.get_person_by_id(2)

#wa1 = hwa.get_work_time_account_by_id(4)
hwa.create_time_interval(1, '20221605', '20221605', '20221605', 3)


#p1 = hwa.get_project_by_id(1)

#hwa.create_activity_for_project('Test Activity', 10, p1)
# end1 = hwa.get_end_event_by_id(1)
# end1.set_last_edit('20010101')
# hwa.save_end_event(end1)
#hwa.save_person(ee1)



#hwa.save_end_event(ee1)

# wa1 = hwa.get_work_time_account_by_id(2)
# print(wa1)

# end1 = hwa.create_end_event(1, '20220305', '20220908')
# print(end1)

if __name__ == '__main__':
    app.run(debug=False)

