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

# BusinessObject dient als Basisklasse, auf der die weiteren Strukturen aufsetzen.
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'),
    'last_edit': fields.DateTime(attribute='_last_edit', description='Der Zeitpunkt der letzten Änderung')
})

activity = api.inherit('Activity', {
    'name': fields.String(description='Name einer Aktivität'),
    'capacity': fields.Integer(description='Kapazität einer Aktivität'),
})

person = api.inherit('Person', bo, {
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lastname', description='Nachname eines Benutzers'),
    'mailaddress': fields.String(attribute='_mailaddress', description='E-Mail-Adresse eines Benutzers'),
    'username': fields.String(attribute='_username', description='Username eines Benutzers'),
    'firebase_id': fields.String(attribute='_firebase_id', description='Google User ID eines Benutzers')
})

work_time_account= api.inherit('Worktimeaccout', {
    'name': fields.String(description='Name des Inhalts'),
    'time': fields.String(description='Dauer des Inhalts')
})

project = api.inherit('Project', bo, {
    'project_name': fields.String(attribute='_project_name', description='Name eines Projekts'),
    'client': fields.String(attribute='_client', description='Auftraggeber eines Projekts'),
    'time_interval_id': fields.Integer(attribute='_time_interval_id', description='Laufzeit eines Projekts'),
    'owner': fields.Integer(attribute='_owner', description='Der Leiter eines Projekts')
})

projectwork = api.inherit('ProjectWork', bo, {
    'project_work_name': fields.String(attribute='_project_work_name', description='Name einer Projektarbeit'),
    'description': fields.String(attribute='_description', description='Beschreibung einer Projektarbeit'),
    'affiliated_activity': fields.Integer(attribute='_affiliated_activity', description='Zugeordnete Aktivität einer P.')
})


timeinterval = api.inherit('TimeInterval', bo, {
    'starttime': fields.DateTime(attribute='__start_time', description='Startzeitpunkt eines Zeitintervalls'),
    'endtime': fields.DateTime(attribute='__end_time', description='Endzeitpunkt eines Zeitintervalls'),
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


@hdmwebapp.route('/worktimeaccount/<int:id>')
@hdmwebapp.param('id', 'Die ID des Person-Objekts')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class WorkTimeAccountContentList(Resource):
    @hdmwebapp.marshal_list_with(work_time_account)
    def get(self, id):
        hwa = HdMWebAppAdministration()
        result = []
        projects = hwa.get_project_by_person_id(id)
        for p in projects:
            result.append({"name": p._project_name, "time": 10})
        time_intervals = hwa.get_time_interval_by_person_id(id)
        result.append({"name": "Arbeitszeit", "time": sum([t.get_time_period() for t in time_intervals])})

        print(result)
        return result

@hdmwebapp.route('/activities')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ActivitiesList(Resource):
    @hdmwebapp.marshal_list_with(activity)
    def get(self):
        hwa = HdMWebAppAdministration()
        result = []
        activities = hwa.get_all_activities()
        for a in activities:
            result.append({"name" : a._name, "capacity": a._capacity})
        print(result)
        return result


@hdmwebapp.route('/projects')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectListOperations(Resource):
    @hdmwebapp.marshal_list_with(project)
    def get(self):
        hwa = HdMWebAppAdministration()
        projects = hwa.get_all_projects()

        return projects


@hdmwebapp.route('/activities/<int:id>/projectworks')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID der Aktivität')
class ProjectWorksByActivityOperations(Resource):
    @hdmwebapp.marshal_list_with(projectwork)
    def get(self, id):
        hwa = HdMWebAppAdministration()
        act = hwa.get_activity_by_id(id)
        # Die durch die id gegebene Aktivität als Objekt speichern.

        if act is not None:
            projectwork_list = hwa.get_projectworks_by_activity(act)
            # Auslesen der Projektarbeiten, die der Aktivität untergliedert sind.
            return projectwork_list
        else:
            return "Activity not found", 500

h = HdMWebAppAdministration()
test = h.get_activity_by_project_id(1)
print(test)

if __name__ == '__main__':
    app.run(debug=False)

