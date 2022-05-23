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

# hwa.create_person("hans", "peter", "userhans","mail@mail", 44)
# hwa.create_event(1, datetime.datetime.now())
# hwa.create_event(2, "20200202")

se = hwa.get_event_by_id(1)
ee = hwa.get_event_by_id(2)

# hwa.create_time_interval(se, ee, 7)
ti1 = hwa.get_time_interval_by_id(1)
pe3 = hwa.get_person_by_id(3)

# hwa.create_project("project2", "client2", ti1, pe1)

pr2 = hwa.get_project_by_id(2)

hwa.create_project_member(pr2, pe3)


'''
p1 = hwa.get_person_by_id(1)
pro1 = hwa.get_project_by_id(1)
hwa.delete_project(pro1)'''


'''if __name__ == '__main__':
    app.run(debug=False)'''

