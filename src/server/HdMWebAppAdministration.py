import datetime
from .bo.Arrive import Arrive
from .bo.Departure import Departure
from .bo.Person import Person
from .bo.Activity import Activity
from .bo.TimeInterval import TimeInterval
from .bo.Project import Project
from .bo.ProjectWork import ProjectWork
from .bo.Event import Event
from .db.PersonMapper import PersonMapper
from .db.ArriveMapper import ArriveMapper
from .db.DepartureMapper import DepartureMapper
from .db.ActivityMapper import ActivityMapper
from .bo.TimeIntervalTransaction import TimeIntervalTransaction
from .db.TimeIntervalTransactionMapper import TimeIntervalTransactionMapper
from .db.EventTransactionMapper import EventTransactionMapper
from .bo.EventTransaction import EventTransaction
from .bo.WorkTimeAccount import WorkTimeAccount
from .db.WorkTimeAccountMapper import WorkTimeAccountMapper
from .db.ProjectMapper import ProjectMapper
from .db.ProjectWorkMapper import ProjectWorkMapper
from .db.TimeIntervalMapper import TimeIntervalMapper
from .db.EventMapper import EventMapper


class HdMWebAppAdministration(object):

    def __init__(self):
        pass

    """Methoden für Person:"""

    def get_person_by_id(self, number):
        """Die Person mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_persons(self):
        """Alle in der Datenbank gespeicherten Personen auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_all()

    def create_person(self, firstname, lastname, username, mailaddress, firebase_id):
        person = Person()
        person.set_id(1)
        person.set_last_edit(datetime.datetime.now())
        person.set_firstname(firstname)
        person.set_lastname(lastname)
        person.set_username(username)
        person.set_mailaddress(mailaddress)
        person.set_firebase_id(firebase_id)

        with PersonMapper() as mapper:
            mapper.insert(person)

    def delete_person(self, person):
        """Gegebene Person aus System löschen"""
        with PersonMapper() as mapper:
            mapper.delete(person)

    def save_person(self, person):
        """Die gegebene Person speichern."""
        person.set_last_edit(datetime.datetime.now())
        with PersonMapper() as mapper:
            mapper.update(person)

    """Methoden für Kommen:"""

    def create_arrive_event(self, time_stamp):
        """Arrive-Ereignis anlegen"""
        arrive = Arrive()
        arrive.set_id(1)
        arrive.set_last_edit(datetime.datetime.now())
        arrive.set_time_stamp(time_stamp)

        with ArriveMapper() as mapper:
            return mapper.insert(arrive)

    def delete_arrive_event(self, arrive):
        """Die gegebene Person aus unserem System löschen."""

        with ArriveMapper() as mapper:
            mapper.delete(arrive)

    def save_arrive_event(self, arrive):
        """Eine Start-Ereignis-Instanz speichern."""
        arrive.set_last_edit(datetime.datetime.now())
        with ArriveMapper() as mapper:
            mapper.update(arrive)

    def get_arrive_event_by_id(self, number):
        """Das Start-Ereignis mit der gegebenen ID auslesen"""
        with ArriveMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_arrive_events(self):
        """Alle in der Datenbank gespeicherten Start-Ereignisse auslesen."""
        with ArriveMapper() as mapper:
            return mapper.find_all()

    """Methoden für Gehen:"""

    def create_departure_event(self, time_stamp):
        """End-Ereignis anlegen"""
        departure = Departure()
        departure.set_id(1)
        departure.set_last_edit(datetime.datetime.now())
        departure.set_time_stamp(time_stamp)

        with DepartureMapper() as mapper:
            return mapper.insert(departure)

    def delete_departure_event(self, departure):
        """Das gegebene End-Ereignis aus unserem System löschen."""
        with DepartureMapper() as mapper:
            mapper.delete(departure)

    def save_departure_event(self, departure):
        """Eine End-Ereignis-Instanz speichern."""
        departure.set_last_edit(datetime.datetime.now())
        with DepartureMapper() as mapper:
            mapper.update(departure)

    def get_departure_event_by_id(self, number):
        """Das End-Ereignis mit der gegebenen ID auslesen"""
        with DepartureMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_departure_events(self):
        """Alle in der Datenbank gespeicherten End-Ereignisse auslesen."""
        with DepartureMapper() as mapper:
            return mapper.find_all()

    """Methoden für Aktivität:"""

    def create_activity_for_project(self, name, capacity, project):
        """Aktivität anlegen"""
        with ActivityMapper() as mapper:
            if project is not None:
                activity = Activity()
                activity.set_id(1)
                activity.set_last_edit(datetime.datetime.now())
                activity.set_name(name)
                activity.set_capacity(capacity)
                activity.set_affiliated_project(project.get_id())

                return mapper.insert(activity)
            else:
                return None

    def delete_activity(self, activity):
        """Die gegebene Aktivität aus unserem System löschen."""
        with ActivityMapper() as mapper:
            mapper.delete(activity)

    def save_activity(self, activity):
        """Eine Aktivitäts-Instanz speichern."""
        activity.set_last_edit(datetime.datetime.now())
        with ActivityMapper() as mapper:
            mapper.update(activity)

    def get_activity_by_id(self, number):
        """Die Aktivität mit der gegebenen ID auslesen"""
        with ActivityMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_activities(self):
        """Alle in der Datenbank gespeicherten Aktivitäten auslesen."""
        with ActivityMapper() as mapper:
            return mapper.find_all()

    """Methoden für EventTransaktionen"""

    def get_event_transaction_by_id(self, number):
        """Die EventTransaction mit der gegebenen EventTransaction-ID auslesen."""
        with EventTransactionMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_event_transactions(self):
        """Alle in der Datenbank gespeicherten EventTransactions auslesen."""
        with EventTransactionMapper() as mapper:
            return mapper.find_all()

    def get_event_transaction_by_affiliated_work_time_account_id(self, affiliated_work_time_account_id):
        """Die EventTransaction mit der gegebenen WorkTimeAccount-ID auslesen."""
        with EventTransactionMapper() as mapper:
            return mapper.find_by_affiliated_work_time_account_id(affiliated_work_time_account_id)

    def save_event_transaction(self, event_transaction):
        """Die gegebene EventTransaction speichern."""
        event_transaction.set_last_edit(datetime.datetime.now())
        with EventTransactionMapper() as mapper:
            mapper.update(event_transaction)

    def delete_event_transaction(self, event_transaction):
        """Die gegebene EventTransaction löschen."""
        with EventTransactionMapper() as mapper:
            mapper.delete(event_transaction)

    def create_event_transaction(self, event, work_time_account):
        """Eine EventTransaction erstellen."""
        t = EventTransaction()
        t.set_id(1)
        t.set_last_edit(datetime.datetime.now())
        t.set_affiliated_work_time_account(work_time_account.get_id())
        t.set_event(event.get_id())

        with EventTransactionMapper() as mapper:
            return mapper.insert(t)

    """Methoden für TimeIntervalTransaktionen"""

    def get_time_interval_transaction_by_id(self, number):
        """Die TimeIntervalTransaction mit der gegebenen TimeIntervalTransaction-ID auslesen."""
        with TimeIntervalTransactionMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_time_interval_transactions(self):
        """Alle in der Datenbank gespeicherten TimeIntervalTransactions auslesen."""
        with TimeIntervalTransactionMapper() as mapper:
            return mapper.find_all()

    def get_time_interval_transaction_by_affiliated_work_time_account_id(self, affiliated_work_time_account_id):
        """Die TimeIntervalTransaction mit der gegebenen WorkTimeAccount-ID auslesen."""
        with TimeIntervalTransactionMapper() as mapper:
            return mapper.find_by_affiliated_work_time_account_id(affiliated_work_time_account_id)

    def save_time_interval_transaction(self, time_interval_transaction):
        """Die gegebene TimeIntervalTransaction speichern."""
        time_interval_transaction.set_last_edit(datetime.datetime.now())
        with TimeIntervalTransactionMapper() as mapper:
            mapper.update(time_interval_transaction)

    def delete_time_interval_transaction(self, time_interval_transaction):
        """Die gegebene TimeIntervalTransaction löschen."""
        with TimeIntervalTransactionMapper() as mapper:
            mapper.delete(time_interval_transaction)

    def create_time_interval_transaction(self, time_interval, work_time_account):
        """Eine TimeIntervalTransaction erstellen."""
        with TimeIntervalTransactionMapper() as mapper:
            if time_interval and work_time_account is not None:
                t = TimeIntervalTransaction()
                t.set_id(1)
                t.set_last_edit(datetime.datetime.now())
                t.set_affiliated_work_time_account(work_time_account.get_id())
                t.set_affiliated_time_interval(time_interval.get_id())

                return mapper.insert(t)
            else:
                return None

    """Methoden für WorkTimeAccount:"""

    def get_all_work_time_accounts(self):
        """Arbeitszeitkont anhand der id auslesen"""
        with WorkTimeAccountMapper() as mapper:
            return mapper.find_all()

    def get_work_time_account_by_id(self, number):
        """Arbeitszeitkonto anhand des Key auslesen"""
        with WorkTimeAccountMapper() as mapper:
            return mapper.find_by_key(number)

    def get_work_time_account_of_owner(self, owner):
        """Alle Konten des gegebenen Kunden auslesen."""
        with WorkTimeAccountMapper() as mapper:
            return mapper.find_by_owner_id(owner.get_id())

    def create_work_time_account_for_person(self, person):
        """Arbeitszeitkonto anlegen"""
        with WorkTimeAccountMapper() as mapper:
            if person is not None:
                work_time_account = WorkTimeAccount()
                work_time_account.set_id(1)
                work_time_account.set_last_edit(datetime.datetime.now())
                work_time_account.set_owner(person.get_id())

                return mapper.insert(work_time_account)
            else:
                return None

    def save_work_time_account(self, work_time_account):
        work_time_account.set_last_edit(datetime.datetime.now())
        with WorkTimeAccountMapper() as mapper:
            mapper.update(work_time_account)

    def delete_work_time_account(self, work_time_account):
        """Arbeitszeitkonto löschen"""
        with WorkTimeAccountMapper() as mapper:
            # wenn es transactions gibt, müssen die mit if abfrage gelöscht werden
            mapper.delete(work_time_account)

    """Project Methoden"""

    def get_project_by_id(self, number):
        """Das Projekt wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_projects(self):
        with ProjectMapper() as mapper:
            return mapper.find_all()

    def create_project(self, project_name, client, project_term_id):
        """Erstellen eines neuen Projekts"""
        project = Project()
        project.set_id(1)
        project.set_last_edit(datetime.datetime.now())
        project.set_project_name(project_name)
        project.set_client(client)
        project.set_time_interval_id(project_term_id)

        with ProjectMapper() as mapper:
            return mapper.insert(project)

    def delete_project(self, project):
        with ProjectMapper() as mapper:
            return mapper.delete(project)

    def save_project(self, project):
        # Vor dem Speichern wird der last_edit zu aktuellen Zeitpunkt gesetzt
        project.set_last_edit(datetime.datetime.now())
        with ProjectMapper() as mapper:
            return mapper.update(project)

    """ProjectWork Methoden"""

    def get_projectwork_by_id(self, number):
        """Das ProjektWork wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectWorkMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_project_works(self):
        with ProjectWorkMapper() as mapper:
            return mapper.find_all()

    def create_project_work(self, project_work_name, description):
        """Erstellen eines neuen ProjektWorks"""
        project_work = ProjectWork()
        project_work.set_id(1)
        project_work.set_last_edit(datetime.datetime.now())
        project_work.set_project_work_name(project_work_name)
        project_work.set_description(description)

        with ProjectWorkMapper() as mapper:
            return mapper.insert(project_work)

    def delete_project_work(self, project_work):
        with ProjectWorkMapper() as mapper:
            return mapper.delete(project_work)

    def save_project_work(self, project_work):
        # Vor dem Speichern wird der last_edit zu aktuellen Zeitpunkt gesetzt
        project_work.set_last_edit(datetime.datetime.now())
        with ProjectWorkMapper() as mapper:
            return mapper.update(project_work)

    """Methoden von TimeInterval"""

    def create_time_interval(self, start_time, end_time, time_period):
        """ZeitIntervalkonto anlegen"""
        interval = TimeInterval()
        interval.set_id(1)
        '''Setzen des Last_edit durch die aktuelle Zeit'''
        interval.set_last_edit(datetime.datetime.now())
        interval.set_start_time(start_time)
        interval.set_end_time(end_time)
        interval.set_time_period(time_period)

        with TimeIntervalMapper() as mapper:
            return mapper.insert(interval)

    def delete_time_interval(self, time_interval):
        """Zeitinterval löschen"""
        with TimeIntervalMapper() as mapper:
            mapper.delete(time_interval)

    def get_time_interval_by_id(self, number):
        """Zeitinterval suchen über eine Id"""
        with TimeIntervalMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_time_interval(self):
        """Zeitinterval alle suchen"""
        with TimeIntervalMapper() as mapper:
            return mapper.find_all()

    def save_time_interval(self, value):
        value.set_last_edit(datetime.datetime.now())
        with TimeIntervalMapper() as mapper:
            return mapper.update(value)

    """Methoden von Event"""

    def create_event(self, event_id, last_edit, event_type):
        """Event-Ereignis anlegen"""
        event = Event()
        event.set_id(event_id)
        event.set_last_edit(last_edit)
        event.set_type(event_type)

        with EventMapper() as mapper:
            return mapper.insert(event)

    def delete_event(self, event):
        """Das gegebene Event-Ereignis aus unserem System löschen."""
        with EventMapper() as mapper:
            mapper.delete(event)

    def save_event(self, event):
        """Eine Event-Instanz speichern."""
        with EventMapper() as mapper:
            mapper.update(event)

    def get_event_by_id(self, number):
        """Die Events mit der gegebenen ID auslesen"""
        with EventMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_events(self):
        """Alle in der Datenbank gespeicherten Events auslesen."""
        with EventMapper() as mapper:
            return mapper.find_all()
