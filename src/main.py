from datetime import datetime
from datetime import timedelta

from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS
from threading import *
from server.HdMWebAppAdministration import HdMWebAppAdministration
from server.bo.Activity import Activity
from server.bo.Event import Event
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

work_performance = api.inherit('Worktimeaccout', {
    'name': fields.String(description='Name des Inhalts'),
    'start_time': fields.String(description='Dauer des Inhalts'),
    'end_time': fields.String(description='Dauer des Inhalts'),
    'period': fields.String(description='Dauer des Inhalts')
})

project = api.inherit('Project', bo, {
    'project_name': fields.String(attribute='_project_name', description='Name eines Projekts'),
    'client': fields.String(attribute='_client', description='Auftraggeber eines Projekts'),
    'timeinterval_id': fields.Integer(attribute='_time_interval_id', description='Laufzeit eines Projekts'),
    'owner': fields.Integer(attribute='_owner', description='Der Leiter eines Projekts'),
    'work_time': fields.String(attribute='_work_time', description='Zeit, die für ein Projekt gearbeitet wurde')
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
    'affiliated_activity': fields.Integer(attribute='_affiliated_activity_id', description='Zugeordnete Aktivität einer P.')
})

timeintervaltransaction = api.inherit('TimeIntervalTransaction', bo, {
    'affiliated_time_interval': fields.Integer(attribute='_affiliated_time_interval',
                                               description='Zugehöriges TimeInterval einer TimIntervalTransaction'),
    'affiliated_break': fields.Integer(attribute='_affiliated_break',
                                                description='Zugehörige Pause einer TimeIntervalTransaction'),
    'affiliated_projectwork': fields.Integer(attribute='_affiliated_projectwork',
                                             description='Zugehörige ProjectWork einer TimeIntervalTransaction')
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
            c = ha.create_person(proposal.get_firstname(), proposal.get_lastname, proposal.get_mailaddress,
                                 proposal.get_firebase_id())
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
        person = hwa.get_person_by_id(id)
        projects = hwa.get_project_by_person_id(id)
        result.append({"name": "Arbeitszeit", "time": hwa.calculate_sum_of_time_intervals_by_person(person)})
        for p in projects:
            result.append({"name": p.get_project_name(), "time": hwa.calculate_sum_of_project_work_by_person(person)})
        return result


@hdmwebapp.route('/workperformance/<int:id>')
@hdmwebapp.param('id', 'Die ID des Arbeitszeitkonto-Objekts')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class WorkTimeAccountContentList(Resource):
    @hdmwebapp.marshal_list_with(work_performance)
    @secured
    def get(self, id, start_time, end_time):
        hwa = HdMWebAppAdministration()
        result = []
        person = hwa.get_person_by_id(id)
        result = hwa.get_intervals_of_person_between_time_stamps(person, start_time, end_time)
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
            result.append({"name": a._name, "capacity": a._capacity})
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


@hdmwebapp.route('/projects/<int:id>' )
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectListOperations(Resource):
    @hdmwebapp.marshal_list_with(project)
    #@secured
    def get(self, id):
        hwa = HdMWebAppAdministration()
        person = hwa.get_person_by_id(id)
        projects = hwa.get_project_by_person_id(person)
        return projects

@hdmwebapp.route('/projects/<int:id>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID des Projekts')
class ProjectOperations(Resource):
    @hdmwebapp.marshal_list_with(projectwork)
    #@secured
    def put(self, id):
        """
        Update eines bestimmten Projektobjektes. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        pro = Project.from_dict(api.payload)

        if pro is not None:
            pro.set_id(id)
            hwa.save_project(pro)
            return '', 200
        else:
            return '', 500

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
            projectwork_list = hwa.get_project_works_of_activity(act)
            # Auslesen der Projektarbeiten, die der Aktivität untergliedert sind.
            print(projectwork_list)
            return projectwork_list

        else:
            return "Activity not found", 500


@hdmwebapp.route('/projectworks/<int:id>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID der Projektarbeit')
class ProjectWorkOperations(Resource):
    @hdmwebapp.marshal_list_with(projectwork)
    @secured
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

    @secured
    def delete(self, id):
        """
        Löschen eines bestimmten Projektarbeitsobjekts. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        pw = hwa.get_project_work_by_id(id)
        hwa.delete_project_work(pw)
        return '', 200

@hdmwebapp.route('/timeintervaltransactions')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class TimeIntervalTransactionOperations(Resource):
    @hdmwebapp.marshal_list_with(timeintervaltransaction)
    @secured
    def get(self):
        hwa = HdMWebAppAdministration()
        tits = hwa.get_all_time_interval_transactions()
        return tits

@hdmwebapp.route('/eventsfortimeintervaltransactions')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class EventsForTimeIntervalTransactions(Resource):
    @hdmwebapp.marshal_list_with(event)
    @secured
    def get(self):
        hwa = HdMWebAppAdministration()
        events = hwa.get_all_event_transactions()
        print(events)
        return events

def check():
    hwa = HdMWebAppAdministration()
    hwa.check_time_for_departure()


sub_thread = Thread(target=check)
#es laufen dann 2 Threads und wenn der Haupt-Thread geschlossen wird, wird der Sub-Thread auch beendet
sub_thread.setDaemon(True)
sub_thread.start()

h = HdMWebAppAdministration()
pe = h.get_person_by_id(2)
print(h.get_last_event_by_affiliated_person(pe))
h.create_event_and_check_type(4, pe)


if __name__ == '__main__':
    app.run(debug=False)
