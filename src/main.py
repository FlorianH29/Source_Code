from datetime import datetime, date
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
from Helper import Helper


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
    'affiliated_project': fields.Integer(attribute='_affiliated_project', description='ID des Projekts'),
    'work_time': fields.String(attribute='_work_time', description='Zeit, die für eine Aktivität gearbeitet wurde')
})

event = api.inherit('Event', bo, {
    'time_stamp': fields.DateTime(attribute='_time_stamp', description='Gespeicherter Zeitpunkt'),
    'event_type': fields.Integer(attribute='_event_type', description='Typ eines Events, Start oder Ende, für B und PW'),
    'affiliated_person': fields.Integer(attribute='_affiliated_person', description='ID der Person, die Event besitzt')
})

person = api.inherit('Person', bo, {
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lastname', description='Nachname eines Benutzers'),
    'username': fields.String(attribute='_username', description='Username eines Benutzers'),
    'mailaddress': fields.String(attribute='_mailaddress', description='E-Mail-Adresse eines Benutzers'),
    'firebase_id': fields.String(attribute='_firebase_id', description='Google User ID eines Benutzers')
})

event_transaction_and_timeintervaltransaction = api.inherit('EventTransaction', {
    'name': fields.String(description='Name des Inhalts'),
    'arriveid': fields.Integer(description='ID des Kommens'),
    'departureid': fields.Integer(description='ID des Gehens'),
    'projectworkid': fields.Integer(description='ID der Projektarbeit'),
    'start_time': fields.DateTime(description='Dauer des Inhalts'),
    'starteventid': fields.Integer(description='ID des Startevents'),
    'endtime': fields.DateTime(description='Dauer des Inhalts'),
    'endeventid': fields.Integer(description='ID des Endevents'),
    'period': fields.String(description='Dauer des Inhalts'),
    'timeintervaltransactionid': fields.Integer(description='ID des Zeitintervals')
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


@hdmwebapp.route('/person')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonByIDOperations(Resource):
    @hdmwebapp.marshal_list_with(person)
    @secured
    def get(self):
        hwa = HdMWebAppAdministration()
        hil = Helper()
        firebase_id = hil.get_firebase_id()
        pers = hwa.get_person_by_firebase_id(firebase_id)
        print(pers)
        return pers

    @secured
    def delete(self):
        """
        Löschen einer bestimmten Person. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        h = Helper()
        firebase_id = h.get_firebase_id()
        per = hwa.get_person_by_firebase_id(firebase_id)
        hwa.delete_person(per)
        return '', 200

    @secured
    def put(self):

        hwa = HdMWebAppAdministration()
        payload = Person.from_dict(api.payload)
        h = Helper()
        firebase_id = h.get_firebase_id()
        fl = hwa.get_person_by_firebase_id(firebase_id)

        if fl is not None:
            fl.set_firstname(payload.get_firstname())
            fl.set_lastname(payload.get_lastname())
            hwa.save_person(fl)
            return '', 200
        else:
            return '', 500


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

"""
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
        """


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


@hdmwebapp.route('/projects/<int:id>/activities')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ActivitiesList(Resource):
    @hdmwebapp.marshal_list_with(activity)
    @secured
    def get(self, id):
        hwa = HdMWebAppAdministration()
        pro = hwa.get_project_by_id(id)
        # Das durch die id gegebene Projekt als Objekt speichern.

        if pro is not None:
            activity_list = hwa.get_activities_of_project(pro)
            # Auslesen der Aktivitäten, die dem Projekt untergliedert sind.
            return activity_list
        else:
            return "Activity not found", 500


@hdmwebapp.route('/activities/<int:id>/work_time')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ActivitiyWorkTimeOperations(Resource):
    @hdmwebapp.marshal_list_with(activity)
    @secured
    def get(self, id, start, end):
        """
        Auslesen der Zeit, die in einem bestimmten Zeitraum für eine Aktivität gearbeitet wurde.
        """
        hwa = HdMWebAppAdministration()
        act = hwa.get_activity_by_id(id)

        start_date = datetime.fromtimestamp(start / 1000.0).date()
        end_date = datetime.fromtimestamp(end / 1000.0).date()

        if act is not None:
            return hwa.get_work_time_of_activity_between_two_dates(act, start_date, end_date)
        else:
            return "Activity not found", 500


@hdmwebapp.route('/events')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class EventOperations(Resource):
    @hdmwebapp.marshal_list_with(event)
    @secured
    def get(self, id):
        """
        Auslesen eines bestimmten Eventobjektes, das nach der id in der URI bestimmt wird.
        """
        hwa = HdMWebAppAdministration()
        ev = hwa.get_event_by_id(id)
        return ev

    @hdmwebapp.marshal_with(event, code=200)
    @secured
    def post(self):
        """
        Anlegen eines Events. Das neu angelegte Event wird als Ergebnis zurückgegeben.
        """
        hwa = HdMWebAppAdministration()
        h = Helper()
        firebase_id = h.get_firebase_id()
        proposal = Event.from_dict(api.payload)
        per = hwa.get_person_by_firebase_id(firebase_id)

        if proposal is not None:
            """ 
            Wenn vom Client ein proposal zurückgegeben wurde, wird ein serverseitiges Eventobjekt erstellt.  
            """
            e = hwa.check_if_first_event(proposal.get_event_type(), per)
            print('event')
            return e, 200
        else:
            return '', 500


@hdmwebapp.route('/projects')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectListOperations(Resource):
    @hdmwebapp.marshal_list_with(project)
    @secured
    def get(self):
        hwa = HdMWebAppAdministration()
        h = Helper()
        firebase_id = h.get_firebase_id()
        per = hwa.get_person_by_firebase_id(firebase_id)
        projects = hwa.get_all_projects_by_person_id(per)
        return projects

    @hdmwebapp.marshal_with(project, code=201)
    @hdmwebapp.expect(project)
    @secured
    def post(self):
        """Erstellen eines neuen Projekts."""

        hwa = HdMWebAppAdministration()
        h = Helper()
        proposal = Project.from_dict(api.payload)

        if proposal is not None:

            project_name = proposal.get_project_name()
            client = proposal.get_client()
            inter = hwa.get_time_interval_by_id(1)  # hier muss das echte Zeitintervall rein
            firebase_id = h.get_firebase_id()
            per = hwa.get_person_by_firebase_id(firebase_id)
            result = hwa.create_project(project_name, client, inter, per)
            return result, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@hdmwebapp.route('/projects/<int:id>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID des Projekts')
class ProjectOperations(Resource):
    @hdmwebapp.marshal_list_with(projectwork)
    @secured
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

    @secured
    def delete(self, id):
        """
        Löschen eines bestimmten Projektobjekts. Objekt wird durch die ID in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        pw = hwa.get_project_by_id(id)
        hwa.delete_project(pw)
        return '', 200


@hdmwebapp.route('/projects/<int:id>/work_time')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectWorkTimeOperations(Resource):
    @hdmwebapp.marshal_list_with(activity)
    @secured
    def get(self, id, start, end):
        """
        Auslesen der Zeit, die in einem bestimmten Zeitraum für ein Projekt gearbeitet wurde.
        """
        hwa = HdMWebAppAdministration()
        pro = hwa.get_project_by_id(id)

        start_date = datetime.fromtimestamp(start / 1000.0).date()
        end_date = datetime.fromtimestamp(end / 1000.0).date()

        if pro is not None:
            return hwa.get_work_time_of_project_between_two_dates(pro, start_date, end_date)
        else:
            return "Activity not found", 500


@hdmwebapp.route('/projectworks')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectWorksOperations(Resource):
    @hdmwebapp.marshal_with(projectwork, code=201)
    @hdmwebapp.expect(projectwork)
    @secured
    def post(self):
        """Erstellen einer neuen Projektarbeit."""

        hwa = HdMWebAppAdministration()
        h = Helper()
        proposal = ProjectWork.from_dict(api.payload)

        if proposal is not None:

            project_work_name = proposal.get_project_work_name()
            description = proposal.get_description()
            act = hwa.get_activity_by_id(proposal.get_affiliated_activity())
            firebase_id = h.get_firebase_id()
            per = hwa.get_person_by_firebase_id(firebase_id)
            result = hwa.create_project_work(project_work_name, description, act, per)
            print('pw')
            return result, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
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


@hdmwebapp.route('/projectworks/<int:id>/<string:name>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID der Projektarbeit')
@hdmwebapp.param('name', 'Der neue Name der Projektarbeit')
class ProjectWorkUpdateNameOperations(Resource):
    @hdmwebapp.marshal_list_with(projectwork)
    @secured
    def put(self, id, name):
        """
        Update eines bestimmten Projektarbeitsobjektes. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        pw = hwa.get_project_work_by_id(id)

        if pw is not None:
            pw.set_project_work_name(name)
            hwa.save_project_work(pw)
            return '', 200
        else:
            return '', 500


@hdmwebapp.route('/events/<int:id>/<int:date>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID des Events')
@hdmwebapp.param('date', 'Der neue Timestamp des Events')
class EventUpdateDateOperations(Resource):
    @hdmwebapp.marshal_list_with(event)
    @secured
    def put(self, id, date):
        """
        Update eines bestimmten Projektarbeitsobjektes. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        event = hwa.get_event_by_id(id)

        if event is not None:
            event.set_time_stamp(datetime.fromtimestamp(date/1000.0))
            hwa.save_event(event)
            return '', 200
        else:
            return '', 500


@hdmwebapp.route('/arrive/<int:id>/<int:date>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID des Events')
@hdmwebapp.param('date', 'Der neue Timestamp des Events')
class ArriveUpdateDateOperations(Resource):
    @hdmwebapp.marshal_list_with(event)
    @secured
    def put(self, id, date):
        """
        Update eines bestimmten Projektarbeitsobjektes. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        arrive = hwa.get_arrive_event_by_id(id)

        if arrive is not None:
            arrive.set_time_stamp(datetime.fromtimestamp(date/1000.0))
            hwa.save_arrive_event(arrive)
            return '', 200
        else:
            return '', 500

@hdmwebapp.route('/departure/<int:id>/<int:date>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID des Events')
@hdmwebapp.param('date', 'Der neue Timestamp des Events')
class DepartureUpdateDateOperations(Resource):
    @hdmwebapp.marshal_list_with(event)
    @secured
    def put(self, id, date):
        """
        Update eines bestimmten Projektarbeitsobjektes. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        departure = hwa.get_departure_event_by_id(id)

        if departure is not None:
            departure.set_time_stamp(datetime.fromtimestamp(date / 1000.0))
            hwa.save_departure_event(departure)
            return '', 200
        else:
            return '', 500


@hdmwebapp.route('/eventtransactionsandtimeintervaltransactions/<int:startDate>/<int:endDate>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('startDate', 'eingegebenes Start-Datum')
@hdmwebapp.param('endDate', 'eingegebenes Start-Datum')
class EventsForTimeIntervalTransactions(Resource):
    @hdmwebapp.marshal_list_with(event_transaction_and_timeintervaltransaction)
    @secured
    def get(self, startDate, endDate):
        hwa = HdMWebAppAdministration()
        h = Helper()
        firebase_id = h.get_firebase_id()
        pe = hwa.get_person_by_firebase_id(firebase_id)
        start_time = datetime.fromtimestamp(startDate/1000.0).date()
        end_time = datetime.fromtimestamp(endDate/1000.0).date()
        events = hwa.get_intervals_of_person_between_time_stamps(pe, start_time, end_time)
        print(events)
        return events


@hdmwebapp.route('/timeinterval/<int:id>')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID des Zeitintervalls')
class DeleteTimeInterval(Resource):
    @hdmwebapp.marshal_list_with(event_transaction_and_timeintervaltransaction)
    @secured
    def delete(self, id):
        """
        Löschen eines bestimmten Projektarbeitsobjekts. Objekt wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        tit = hwa.get_time_interval_transaction_by_id(id)
        hwa.delete_time_interval_transaction(tit)
        return '', 200


@hdmwebapp.route('/projectworks/<int:id>/owner')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@hdmwebapp.param('id', 'Die ID des ProjectWork-Objekts')
class ProjectWorkOwnerOperations(Resource):
    @hdmwebapp.marshal_list_with(person)
    @secured
    def get(self, id):
        """Auslesen des Erstellers eines bestimmten Projektarbeit-Objekts.
        Das Projektarbeit-Objekt dessen Ersteller ausgelesen werden soll, wird durch die id in dem URI bestimmt.
        """
        hwa = HdMWebAppAdministration()
        pw = hwa.get_project_work_by_id(id)
        start_pw_id = pw.get_start_event()
        start_pw = hwa.get_event_by_id(start_pw_id)

        if start_pw is not None:
            owner = hwa.get_person_by_id(start_pw.get_affiliated_person())
            return owner
        else:
            return 0, 500


def check():
    hwa = HdMWebAppAdministration()
    hwa.check_time_for_departure()


sub_thread = Thread(target=check)
#es laufen dann 2 Threads und wenn der Haupt-Thread geschlossen wird, wird der Sub-Thread auch beendet
sub_thread.setDaemon(True)
sub_thread.start()

h = HdMWebAppAdministration()



if __name__ == '__main__':
    app.run(debug=False)
