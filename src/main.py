from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS

from server.HdMWebAppAdministration import HdMWebAppAdministration
from server.bo.Activity import Activity
from server.bo.Person import Person
from server.bo.Project import Project
from server.bo.ProjectWork import ProjectWork
from server.bo.WorkTimeAccount import WorkTimeAccount
from SecurityDecorator import secured


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
    'start_event': fields.DateTime(attribute='_start_event', description='Startzeitpunkt eines Zeitintervalls'),
    'end_event': fields.DateTime(attribute='_end_event', description='Endzeitpunkt eines Zeitintervalls'),
    'time_period': fields.String(attribute='_time_period', description='Zeitraum des Intervalls')
})

projectwork = api.inherit('ProjectWork', timeinterval, {
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
    @secured
    def get(self):
        hwa = HdMWebAppAdministration()
        persons = hwa.get_all_persons()
        return persons

    @hdmwebapp.marshal_with(person, code=200)
    @hdmwebapp.expect(person)  # Wir erwarten ein Customer-Objekt von Client-Seite.
    @secured
    def post(self):

        ha = HdMWebAppAdministration()

        proposal = Person.from_dict(api.payload)

        if proposal is not None:
            c = ha.create_person(proposal.get_firstname(), proposal.get_lastname, proposal.get_mailaddress, proposal.get_firebase_id ())
            return c, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@hdmwebapp.route('/person-by-name/<string:lastname>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('lastname', 'Der Nachname des Kunden')
class CustomersByNameOperations(Resource):
    @hdmwebapp.marshal_with(person)
    @secured
    def get(self, lastname):
        """ Auslesen von Customer-Objekten, die durch den Nachnamen bestimmt werden.

        Die auszulesenden Objekte werden durch ```lastname``` in dem URI bestimmt.
        """
        adm = HdMWebAppAdministration()
        lel = adm.get_person_by_name(lastname)
        return lel



@hdmwebapp.route('/worktimeaccount/<int:id>')
@hdmwebapp.param('id', 'Die ID des Arbeitszeitkonto-Objekts')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class WorkTimeAccountContentList(Resource):
    @hdmwebapp.marshal_list_with(work_time_account)
    @secured
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
    @secured
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
    @secured
    def get(self):
        hwa = HdMWebAppAdministration()
        projects = hwa.get_all_projects()

        return projects


@hdmwebapp.route('/activities/<int:id>/projectworks')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID der Aktivität')
class ProjectWorksByActivityOperations(Resource):
    @hdmwebapp.marshal_list_with(projectwork)
    @secured
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
    @secured
    def put(self, id):
        hwa = HdMWebAppAdministration()
        pw = ProjectWork.from_dict(api.payload)

        if pw is not None:
            pw.set_id(id)
            hwa.save_project_work(pw)
            return '', 200
        else:
            return '', 500

    def delete(self, id):
        """Löschen eines bestimmten Projektarbeitsobjekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        pw = hwa.get_projectwork_by_id(id)
        hwa.delete_project_work(pw)
        return '', 200



if __name__ == '__main__':
    app.run(debug=False)

