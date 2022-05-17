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

hdmwebapp = api.namespace('hdmwebapp', description='Funktionen der HdMWebApp zur Zeitbuchung.')

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

project = api.inherit('Project', bo, {
    'projectname': fields.String(attribute='__project_name', description='Name eines Projekts'),
    'client': fields.String(attribute='__client', description='Auftraggeber eines Projekts'),
    'project_term_id': fields.String(attribute='__project_term_id', description='Laufzeit eines Projekts')
})

worktimeaccount = api.inherit('WorkTimeAccount', bo, {
    'owner': fields.String(attribute='__owner', description='Besitzer eines Arbeitszeitkonto')
})

timeinterval = api.inherit('TimeInterval', bo, {
    'starttime': fields.String(attribute='__start_time', description='Startzeitpunkt eines Zeitintervalls'),
    'endtime': fields.String(attribute='__end_time', description='Endzeitpunkt eines Zeitintervalls'),
    'timeperiod': fields.String(attribute='__time_period', description='Zeitraum des Intervalls')
})


# hier könnt ihr eure Tests reinschreiben, bitte bevor ihr auf den Main-pushed löschen!!!

hwa = HdMWebAppAdministration()

#Test für Update-Befehl
# et = hwa.get_event_transaction_by_id(1)
# et.set_event(1)
# hwa.save_event_transaction(et)



my_time_inter = hwa.create_time_interval(20000101, 20000105, 5)

my_project = hwa.create_project("my_project", "My_client", my_time_inter)



'''dt1 = datetime.datetime(2022, 5, 17)
dt2 = datetime.datetime.now()
print(dt1)
print(dt2)

dt3 = dt2 - dt1
print(type(dt3))'''


if __name__ == '__main__':
    app.run(debug=False)

