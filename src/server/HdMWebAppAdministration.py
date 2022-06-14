import datetime
import time
from .bo.Arrive import Arrive
from .bo.Break import Break
from .bo.Departure import Departure
from .bo.Person import Person
from .bo.Activity import Activity
from .bo.TimeInterval import TimeInterval
from .bo.Project import Project
from .bo.ProjectWork import ProjectWork
from .bo.ProjectMember import ProjectMember
from .bo.Event import Event
from .db.PersonMapper import PersonMapper
from .db.ArriveMapper import ArriveMapper
from .db.BreakMapper import BreakMapper
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
from .db.ProjectMemberMapper import ProjectMemberMapper
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

    def get_all_persons_by_arrive(self):
        """Alle in der Datenbank gespeicherten Personen, welche kein Departure zum letzten Arrive haben, auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_arrive()

    def create_person(self, firstname, lastname, mailaddress, firebase_id):
        """Person anlegen, nach Anlegen der Person Anlegen eines Arbeitszeitkontos für sie."""
        person = Person()
        person.set_id(1)
        person.set_last_edit(datetime.datetime.now())
        person.set_firstname(firstname)
        person.set_lastname(lastname)
        person.set_username(firstname + "_" + lastname)
        person.set_mailaddress(mailaddress)
        person.set_firebase_id(firebase_id)

        with PersonMapper() as mapper:
            return mapper.insert(person), self.create_work_time_account_for_person(person)

    def delete_person(self, person):
        """Gegebene Person aus System löschen, gleichzeitig Person als Mitarbeiter in den Projekten streichen, in denen
         sie beteiligt war und ihr Arbeitszeitkonto löschen."""
        # noch Projektarbeiten und Buchungen von davon, die auf Arbeitszeitkonto sind löschen?
        with PersonMapper() as mapper:
            if person is not None:
                projects = self.get_projectmember_by_person(person)
                worktimeaccounts = self.get_work_time_account_of_owner(person)

                for project in projects:
                    self.delete_project_member(project)

                for worktimeaccount in worktimeaccounts:
                    self.delete_work_time_account(worktimeaccount)

            mapper.delete(person)

    def save_person(self, person):
        """Die gegebene Person speichern."""
        person.set_last_edit(datetime.datetime.now())
        with PersonMapper() as mapper:
            mapper.update(person)

    """Methoden für Kommen:"""

    def create_arrive_event(self, person):
        """Arrive-Ereignis anlegen"""
        arrive = Arrive()
        arrive.set_id(1)
        arrive.set_last_edit(datetime.datetime.now())
        arrive.set_time_stamp(datetime.datetime.now())
        arrive.set_affiliated_person(person.get_id())

        with ArriveMapper() as mapper:
            return mapper.insert(arrive), self.create_event_transaction(None, arrive, None)

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

    def get_arrive_event_by_affiliated_person_id(self, number):
        """Das Start-Ereignis mit der gegebenen zugehörigen Personen ID auslesen"""
        with ArriveMapper() as mapper:
            return mapper.find_by_affiliated_person_id(number)

    def get_last_arrive_by_person(self, person):
        with ArriveMapper() as mapper:
            if person is not None:
                return mapper.find_last_arrive_by_person(person.get_id())
            else:
                return None

    def get_all_arrive_events(self):
        """Alle in der Datenbank gespeicherten Start-Ereignisse auslesen."""
        with ArriveMapper() as mapper:
            return mapper.find_all()

    """Methoden für Gehen:"""

    def create_departure_event(self, person):
        """End-Ereignis anlegen"""
        departure = Departure()
        departure.set_id(1)
        departure.set_last_edit(datetime.datetime.now())
        departure.set_time_stamp(datetime.datetime.now())
        departure.set_affiliated_person(person.get_id())

        with DepartureMapper() as mapper:
            return mapper.insert(departure), self.create_event_transaction(None, None, departure)

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

    def get_departure_event_by_affiliated_person_id(self, number):
        """Das End-Ereignis mit der gegebenen zugehörigen Personen ID auslesen"""
        with DepartureMapper() as mapper:
            return mapper.find_by_affiliated_person_id(number)

    def get_last_departure_by_person(self, person):
        with DepartureMapper() as mapper:
            if person is not None:
                return mapper.find_last_departure_by_person(person.get_id())
            else:
                return None

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
            if activity is not None:
                project_works = self.get_projectworks_of_activity(activity)

                for project_work in project_works:
                    self.delete_project_work(project_work)

                mapper.delete(activity)
            else:
                return None

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

    def get_activities_of_project(self, project):
        """ Akitvitäten werden anhand der eindeutigen ID des Projekts ausgelesen, dem sie zugeordnet sind."""
        with ActivityMapper() as mapper:
            result = []

            if not (project is None):
                activities = mapper.find_by_project_id(project.get_id())
                if not (activities is None):
                    result.extend(activities)
        return result

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
            # nicht ganz löschen, sondern nur deaktivieren
            mapper.delete(event_transaction)

    def create_event_transaction(self, event=None, arrive=None, departure=None):
        """Eine EventTransaction erstellen."""
        with EventTransactionMapper() as mapper:
            if event is not None:
                et = EventTransaction()
                et.set_id(1)
                et.set_last_edit(datetime.datetime.now())
                person = self.get_person_by_id(event.get_affiliated_person())
                et.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                et.set_event(event.get_id())
                return mapper.insert(et)
            elif arrive is not None:
                et = EventTransaction()
                et.set_id(1)
                et.set_last_edit(datetime.datetime.now())
                person = self.get_person_by_id(arrive.get_affiliated_person())
                et.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                et.set_arrive(arrive.get_id())
                return mapper.insert(et)
            elif departure is not None:
                et = EventTransaction()
                et.set_id(1)
                et.set_last_edit(datetime.datetime.now())
                person = self.get_person_by_id(departure.get_affiliated_person())
                et.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                et.set_departure(departure.get_id())
                return mapper.insert(et)
            else:
                return None

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
            # nicht ganz löschen, sondern nur deaktivieren
            mapper.delete(time_interval_transaction)

    def create_time_interval_transaction(self, person, time_interval=None, affiliated_break=None,
                                         projectwork=None):
        """Eine TimeIntervalTransaction erstellen."""
        with TimeIntervalTransactionMapper() as mapper:
            if time_interval and person is not None:
                t = TimeIntervalTransaction()
                t.set_id(1)
                t.set_last_edit(datetime.datetime.now())
                t.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                t.set_affiliated_time_interval(time_interval.get_id())
                return mapper.insert(t)
            elif affiliated_break and person is not None:
                t = TimeIntervalTransaction()
                t.set_id(1)
                t.set_last_edit(datetime.datetime.now())
                t.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                t.set_affiliated_break(affiliated_break.get_id())
                return mapper.insert(t)
            elif projectwork and person is not None:
                t = TimeIntervalTransaction()
                t.set_id(1)
                t.set_last_edit(datetime.datetime.now())
                t.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                t.set_affiliated_projectwork(projectwork.get_id())
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
        """Arbeitszeitkonto einer gegebenen Person auslesen."""
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

    def create_project(self, project_name, client, time_interval, person):
        """Erstellen eines neuen Projekts"""
        with ProjectMapper() as mapper:
            if time_interval and person is not None:
                project = Project()
                project.set_id(1)
                project.set_last_edit(datetime.datetime.now())
                project.set_project_name(project_name)
                project.set_client(client)
                project.set_time_interval_id(time_interval.get_id())
                project.set_owner(person.get_id())

                return mapper.insert(project), self.create_project_member(project, person)
                # Nachdem das Projekt erstellt wurde, wird direkt der Ersteller als Projektmitglied hinzugefügt
            else:
                return None

    def delete_project(self, project):
        """Löschen eines Projekts, wenn darin Aktivitäten liegen, werden sie auch gelöscht."""
        with ProjectMapper() as mapper:
            if project is not None:
                activities = self.get_activities_of_project(project)

                for activity in activities:
                    self.delete_activity(activity)

                mapper.delete(project)
            else:
                return None

    def save_project(self, project):
        project.set_last_edit(datetime.datetime.now())
        with ProjectMapper() as mapper:
            return mapper.update(project)

    def get_project_by_person_id(self, person_id):
        """ ProjektWorks werden anhand der eindeutigen ID der Aktivität ausgelesen, der sie zugeordnet sind."""
        with ProjectMapper() as mapper:
            result = []
            if not (person_id is None):
                return mapper.find_by_person_id(person_id)

    """ProjectWork Methoden"""

    def get_projectwork_by_id(self, number):
        """Das ProjektWork wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectWorkMapper() as mapper:
            return mapper.find_by_key(number)

    def get_projectworks_of_activity(self, activity):
        """ ProjektWorks werden anhand der eindeutigen ID der Aktivität ausgelesen, der sie zugeordnet sind."""
        with ProjectWorkMapper() as mapper:
            result = []

            if not (activity is None):
                project_works = mapper.find_by_activity(activity.get_id())
                if not (project_works is None):
                    result.extend(project_works)
            return result

    def get_all_project_works(self):
        with ProjectWorkMapper() as mapper:
            return mapper.find_all()

    def create_project_work(self, project_work_name, description, activity, person):
        """Erstellen eines neuen ProjektWorks"""
        with ProjectWorkMapper() as mapper:
            if activity and person is not None:
                project_work = ProjectWork()
                project_work.set_id(1)
                project_work.set_last_edit(datetime.datetime.now())
                project_work.set_project_work_name(project_work_name)
                project_work.set_description(description)
                project_work.set_affiliated_activity(activity.get_id())
                project_work.set_start_event(self.get_last_start_event_project_work(person).get_id())
                project_work.set_end_event(self.get_last_end_event_project_work(person).get_id())
                project_work.set_time_period(self.calculate_period(project_work))

                return mapper.insert(project_work), \
                       self.create_time_interval_transaction(person, None, None, project_work)
            else:
                return None

    def delete_project_work(self, project_work):
        with ProjectWorkMapper() as mapper:
            return mapper.delete(project_work)

    def save_project_work(self, project_work):
        # Vor dem Speichern wird der last_edit zu aktuellen Zeitpunkt gesetzt
        project_work.set_last_edit(datetime.datetime.now())
        with ProjectWorkMapper() as mapper:
            return mapper.update(project_work)

    def calculate_sum_of_project_work_by_person(self, person):
        time_periods = []
        projects = self.get_project_by_person_id(person.get_id())
        for p in projects:
            ac = self.get_activities_of_project(p)
            for a in ac:
                act = self.get_activity_by_id(a.get_id())
                project_works = self.get_projectworks_of_activity(act)
                for pw in project_works:
                    time_period = pw.get_time_period()
                    time_periods.append(time_period)
        sum_periods = sum(time_periods, datetime.timedelta())
        return sum_periods

    """ProjectMember Methoden"""

    def get_projectmember_by_id(self, number):
        """Das Projekt wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectMemberMapper() as mapper:
            return mapper.find_by_key(number)

    def get_projectmember_by_person(self, person):
        with ProjectMemberMapper() as mapper:
            result = []

            if not (person is None):
                projectmember = mapper.find_projects_by_person_id(person.get_id())
                if not (projectmember is None):
                    result.extend(projectmember)
                return result

    def create_project_member(self, project, person):
        """Erstellen eines neuen Projekts"""
        with ProjectMemberMapper() as mapper:
            if project and person is not None:
                project_m = ProjectMember()
                project_m.set_id(1)
                project_m.set_last_edit(datetime.datetime.now())
                project_m.set_project(project.get_id())
                project_m.set_person(person.get_id())

                return mapper.insert(project_m)
            else:
                return None

    def delete_project_member(self, project_m):
        with ProjectMemberMapper() as mapper:
            return mapper.delete(project_m)

    def save_project_member(self, project_m):
        # Vor dem Speichern wird der last_edit zu aktuellen Zeitpunkt gesetzt
        project_m.set_last_edit(datetime.datetime.now())
        with ProjectMemberMapper() as mapper:
            return mapper.update(project_m)

    def get_project_by_employee(self, person_id):
        with ProjectMemberMapper() as mapper:
            return mapper.find_projects_by_person_id(person_id)

    """Methoden von TimeInterval"""

    def calculate_period(self, timeinterval):
        """Berechnen des Zeitraumes"""
        if timeinterval is not None:
            start = timeinterval.get_start_event()
            end = timeinterval.get_end_event()
            start_time = self.get_event_by_id(start).get_time_stamp()
            end_time = self.get_event_by_id(end).get_time_stamp()
            time_period = end_time - start_time
            return time_period

    def calculate_period_for_arrive_and_departure(self, timeinterval):
        """Berechnen des Zeitraumes"""
        if timeinterval is not None:
            start = timeinterval.get_arrive()
            end = timeinterval.get_departure()
            start_time = self.get_arrive_event_by_id(start).get_time_stamp()
            end_time = self.get_departure_event_by_id(end).get_time_stamp()
            time_period = end_time - start_time
            return time_period

    def create_time_interval(self, start_event, end_event=None):  # defaultmäßig ee= None, da TI kein Ende haben muss
        """Zeitinterval anlegen"""
        with TimeIntervalMapper() as mapper:
            if start_event is not None and start_event.get_event_type() == 1:  # 1 für Start Event, evtl noch apassen
                interval = TimeInterval()
                interval.set_id(1)
                interval.set_last_edit(datetime.datetime.now())
                interval.set_start_event(start_event.get_id())
                if end_event is not None:  # wenn ee übergeben wird: Wert setzen und Intervall berechnen
                    interval.set_end_event(end_event.get_id())
                    interval.set_time_period(self.calculate_period(interval))

                return mapper.insert(interval)
            else:
                return None

    def create_time_interval_for_arrive_and_departure(self, person):
        with TimeIntervalMapper() as mapper:
            if person is not None:
                interval = TimeInterval()
                interval.set_id(1)
                interval.set_last_edit(datetime.datetime.now())
                interval.set_arrive(self.get_last_arrive_by_person(person).get_id())
                interval.set_departure(self.get_last_departure_by_person(person).get_id())
                interval.set_time_period(self.calculate_period_for_arrive_and_departure(interval))

                return mapper.insert(interval)
            else:
                return None

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

    def get_time_interval_by_person_id(self, person_id):
        """ ProjektWorks werden anhand der eindeutigen ID der Aktivität ausgelesen, der sie zugeordnet sind."""
        with TimeIntervalMapper() as mapper:
            if not (person_id is None):
                return mapper.find_by_person_id(person_id)

    def calculate_sum_of_time_intervals_by_person(self, person):
        time_periods = []
        time_intervals = self.get_time_interval_by_person_id(person.get_id())
        for ti in time_intervals:
            period = ti.get_time_period()
            time_periods.append(period)
        sum_periods = sum(time_periods, datetime.timedelta())
        return sum_periods

    """Methoden für Pause"""

    def create_break(self, person):
        """Erstellen einer neuen Pause"""
        with BreakMapper() as mapper:
            if person is not None:
                br = Break()
                br.set_id(1)
                br.set_last_edit(datetime.datetime.now())
                br.set_start_event(self.get_last_start_event_break(person).get_id())
                br.set_end_event(self.get_last_end_event_break(person).get_id())
                br.set_time_period(self.calculate_period(br))

                return mapper.insert(br), self.create_time_interval_transaction(person, None, br, None)
            else:
                return None

    def delete_break(self, br):
        """Pause löschen"""
        with BreakMapper() as mapper:
            mapper.delete(br)

    def get_break_by_id(self, number):
        """Pause suchen über eine Id"""
        with BreakMapper() as mapper:
            return mapper.find_by_key(number)

    def save_break(self, value):
        value.set_last_edit(datetime.datetime.now())
        with BreakMapper() as mapper:
            return mapper.update(value)

    """Methoden von Event"""

    def create_event(self, event_type, person):
        """Event anlegen"""
        with EventMapper() as mapper:
            if event_type and person is not None:
                event = Event()
                event.set_id(1)
                event.set_last_edit(datetime.datetime.now())
                event.set_event_type(event_type)
                event.set_time_stamp(datetime.datetime.now())
                event.set_affiliated_person(person.get_id())
                return mapper.insert(event), self.create_event_transaction(event, None, None)
            else:
                return None

    def create_event_with_time_stamp(self, event_type, time_stamp, person):
        """Event mit Zeitpunkt erstellen"""
        with EventMapper() as mapper:
            if event_type and person and time_stamp is not None:
                event = Event()
                event.set_id(1)
                event.set_last_edit(datetime.datetime.now())
                event.set_event_type(event_type)
                event.set_time_stamp(time_stamp)
                event.set_affiliated_person(person.get_id())
                return mapper.insert(event)
            else:
                return None

    def get_last_start_event_project_work(self, person):
        with EventMapper() as mapper:
            if person is not None:
                return mapper.find_last_start_event_project_work(person.get_id())
            else:
                return None

    def get_last_end_event_project_work(self, person):
        with EventMapper() as mapper:
            if person is not None:
                return mapper.find_last_end_event_project_work(person.get_id())
            else:
                return None

    def get_last_start_event_break(self, person):
        with EventMapper() as mapper:
            if person is not None:
                return mapper.find_last_start_event_break(person.get_id())
            else:
                return None

    def get_last_end_event_break(self, person):
        with EventMapper() as mapper:
            if person is not None:
                return mapper.find_last_end_event_break(person.get_id())
            else:
                return None

    def get_last_event_by_affiliated_person(self, person):
        """Das letzte Event anhand der zugehörigen Personen Id ausgeben."""
        with EventMapper() as mapper:
            if person is not None:
                return mapper.find_last_by_affiliated_person_id(person.get_id())
            else:
                return None

    def delete_event(self, event):
        """Das gegebene Event-Ereignis aus unserem System löschen."""
        with EventMapper() as mapper:
            mapper.delete(event)

    def save_event(self, event):
        """Eine Event-Instanz speichern."""
        event.set_last_edit(datetime.datetime.now())
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

    # Business Logik für Frontend
    def get_project_by_firebase_id(self, value):
        projectmember = self.get_project_by_employee(value)
        project_member_list = []
        project_name_list = []
        counter = 0
        try:
            for i in projectmember:
                # Um die richtige Firebase Id zu getten, muss hier die get_person Methode angepasst werden
                firebase_id = i.get_person()
                project_member_list.append(firebase_id)
                while counter < len(project_member_list):
                    firebase_id = self.get_project_by_id(project_member_list[counter])
                    project = firebase_id.get_project_name()
                    counter = counter + 1
                    project_name_list.append(project)
            return project_name_list
        except AttributeError:
            return print("Keine Projekte gefunden")

    def check_time_for_departure(self):
        while True:
            time.sleep(60)
            persons = self.get_all_persons_by_arrive()
            for person in persons:
                person_id = person.get_id()
                arrive = self.get_last_arrive_by_person(person).get_time_stamp()
                datetime_now = datetime.datetime.now()
                working_time = datetime_now - arrive
                if working_time >= datetime.timedelta(hours=10):
                    event_type = self.get_last_event_by_affiliated_person(person).get_event_type()
                    if event_type == 1:
                        self.create_event(2, person)
                    if event_type == 3:
                        self.create_event(4, person)
                        self.create_break(person)
                    self.create_departure_event(person)
