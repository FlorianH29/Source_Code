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
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lastname', description='Nachname eines Benutzers'),
    'mailaddress': fields.String(attribute='_mailaddress', description='E-Mail-Adresse eines Benutzers'),
    'username': fields.String(attribute='_username', description='Username eines Benutzers'),
    'firebase_id': fields.String(attribute='_firebase_id', description='Google User ID eines Benutzers')
})

project = api.inherit('Project', bo, {
    'project_name': fields.String(attribute='_project_name', description='Name eines Projekts'),
    'client': fields.String(attribute='_client', description='Auftraggeber eines Projekts'),
    'time_interval_id': fields.String(attribute='_time_interval_id', description='Laufzeit eines Projekts'),
    'owner': fields.String(attribute='_owner', description='Der Leiter eines Projekts')
})

worktimeaccount = api.inherit('WorkTimeAccount', bo, {
    'owner': fields.String(attribute='__owner', description='Besitzer eines Arbeitszeitkonto')
})

timeinterval = api.inherit('TimeInterval', bo, {
    'starttime': fields.String(attribute='__start_time', description='Startzeitpunkt eines Zeitintervalls'),
    'endtime': fields.String(attribute='__end_time', description='Endzeitpunkt eines Zeitintervalls'),
    'timeperiod': fields.String(attribute='__time_period', description='Zeitraum des Intervalls')
})

@hdmwebapp.route('/persons')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonListOperations(Resource):
    @hdmwebapp.marshal_list_with(person)
    def get(self):
        hwa = HdMWebAppAdministration()
        persons = hwa.get_all_persons()

        return persons

@hdmwebapp.route('/projects')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectListOperations(Resource):
    @hdmwebapp.marshal_list_with(project)
    def get(self):
        hwa = HdMWebAppAdministration()
        projects = hwa.get_all_projects()

        return projects


'''hwa = HdMWebAppAdministration()

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



p1 = hwa.get_person_by_id(1)
pro1 = hwa.get_project_by_id(1)
hwa.delete_project(pro1)

'''

if __name__ == '__main__':
    app.run(debug=False)

