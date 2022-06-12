import datetime

from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS

from server.HdMWebAppAdministration import HdMWebAppAdministration
from server.bo.Activity import Activity
from server.bo.Event import Event
from server.bo.Person import Person
from server.bo.Project import Project
from server.bo.ProjectWork import ProjectWork
from server.bo.WorkTimeAccount import WorkTimeAccount


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

activity = api.inherit('Activity', bo, {
    'name': fields.String(attribute='_name', description='Name einer Aktivität'),
    'capacity': fields.Integer(attribute='_capacity', description='Kapazität einer Aktivität'),
    'work_time': fields.String(attribute='_work_time', description='Zeit, die für eine Aktivität gearbeitet wurde')
})

event = api.inherit('Event', bo, {
    'event_type': fields.Integer(attribute='_event_type', description='Typ eines Events, Start oder Ende, für B und PW'),
    'time_stamp': fields.DateTime(attribute='_time_stamp', description='Gespeicherter Zeitpunkt'),
    'affiliated_person': fields.Integer(attribute='_affiliated_person', description='ID der Person, die Event besitzt')
})

person = api.inherit('Person', bo, {
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lastname', description='Nachname eines Benutzers'),
    'mailaddress': fields.String(attribute='_mailaddress', description='E-Mail-Adresse eines Benutzers'),
    'username': fields.String(attribute='_username', description='Username eines Benutzers'),
    'firebase_id': fields.String(attribute='_firebase_id', description='Google User ID eines Benutzers')
})

work_time_account = api.inherit('Worktimeaccout', {
    'name': fields.String(description='Name des Inhalts'),
    'time': fields.String(description='Dauer des Inhalts')
})

project = api.inherit('Project', bo, {
    'project_name': fields.String(attribute='_project_name', description='Name eines Projekts'),
    'client': fields.String(attribute='_client', description='Auftraggeber eines Projekts'),
    'time_interval_id': fields.Integer(attribute='_time_interval_id', description='Laufzeit eines Projekts'),
    'owner': fields.Integer(attribute='_owner', description='Der Leiter eines Projekts')
})

timeinterval = api.inherit('TimeInterval', bo, {
    'start_event_id': fields.Integer(attribute='_start_event_id', description='Id des Starts eines Zeitintervalls'),
    'end_event_id': fields.Integer(attribute='_end_event_id', description='Id des Starts eines Zeitintervalls'),
    'time_period': fields.String(attribute='_time_period', description='Zeitraum des Intervalls'),
    'arrive_id': fields.Integer(attribute='_arrive_id', description='Id des Kommen Events'),
    'departure_id': fields.Integer(attribute='_departure_id', description='Id des Gehen Events')
})

projectwork = api.inherit('ProjectWork', timeinterval, {
    'project_work_name': fields.String(attribute='_project_work_name', description='Name einer Projektarbeit'),
    'description': fields.String(attribute='_description', description='Beschreibung einer Projektarbeit'),
    'affiliated_activity': fields.Integer(attribute='_affiliated_activity', description='Zugeordnete Aktivität einer P.')
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
@hdmwebapp.param('id', 'Die ID des Arbeitszeitkonto-Objekts')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class WorkTimeAccountContentList(Resource):
    @hdmwebapp.marshal_list_with(work_time_account)
    def get(self, id):
        hwa = HdMWebAppAdministration()
        result = []
        projects = hwa.get_project_by_person_id(id)
        for p in projects:
            time_intervals_project = hwa.get_time_interval_by_id(p.get_time_interval_id())
            test = time_intervals_project.get_time_period()
            result.append({"name": p._project_name, "time": time_intervals_project.get_time_period()})
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
            result.append({"name": a.get_name(), "capacity": a.get_capacity()})
        print(result)
        return result


@hdmwebapp.route('/events')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class EventOperations(Resource):
    @hdmwebapp.marshal_list_with(event)
    def get(self, id):
        """
        Auslesen eines bestimmten Eventobjektes, das nach der id in der URI bestimmt wird.
        """
        hwa = HdMWebAppAdministration()
        ev = hwa.get_event_by_id(id)
        return ev

    @hdmwebapp.marshal_with(event, code=200)
    def post(self):
        """
        Anlegen eines Events. Das neu angelegte Event wird als Ergebnis zurückgegeben.
        """
        hwa = HdMWebAppAdministration()
        proposal = Event.from_dict(api.payload)
        print(proposal)

        if proposal is not None:
            """ 
            Wenn vom Client ein proposal zurückgegeben wurde, wird ein serverseitiges Eventobjekt erstellt.  
            """
            e = hwa.create_event(proposal.get_event_type(), proposal.get_affiliated_person())
            return e, 200
        else:
            return '', 500


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
            projectwork_list = hwa.get_projectworks_of_activity(act)
            # Auslesen der Projektarbeiten, die der Aktivität untergliedert sind.
            return projectwork_list
        else:
            return "Activity not found", 500


@hdmwebapp.route('/projectworks/<int:id>/')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID der Projektarbeit')
class ProjectWorkOperations(Resource):
    @hdmwebapp.marshal_list_with(projectwork)
    def put(self, id):
        """
        Update eines bestimmten Projektarbeitsobjektes. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        pw = ProjectWork.from_dict(api.payload)

        if pw is not None:
            pw.set_id(id)
            hwa.save_project_work(pw)
            return '', 200
        else:
            return '', 500

    def delete(self, id):
        """
        Löschen eines bestimmten Projektarbeitsobjekts. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        pw = hwa.get_projectwork_by_id(id)
        hwa.delete_project_work(pw)
        return '', 200


h = HdMWebAppAdministration()
e1 = h.get_event_by_id(1)
e2 = h.get_event_by_id(3)
ti = h.get_time_interval_by_id(2)
pe = h.get_person_by_id(1)
pe2 = h.get_person_by_id(2)
pro = h.get_project_by_id(1)
ac = h.get_activity_by_id(1)

if __name__ == '__main__':
    app.run(debug=True)
