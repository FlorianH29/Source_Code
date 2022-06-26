from datetime import timedelta, datetime
import time
import operator
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

    def get_person_by_name(self, lastname):
        """Alle Kunden mit übergebenem Nachnamen auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_lastname(lastname)

    def get_person_by_username(self, username):
        """Alle Kunden mit übergebenem Nachnamen auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_username(username)

    def get_all_persons(self):
        """Alle in der Datenbank gespeicherten Personen auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_all()

    def get_all_persons_by_arrive(self):
        """Alle in der Datenbank gespeicherten Personen, welche kein Departure zum letzten Arrive haben, auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_arrive()

    def create_person(self, username, mailaddress, firebase_id):
        """Person anlegen, nach Anlegen der Person Anlegen eines Arbeitszeitkontos für sie."""
        person = Person()
        person.set_id(1)
        person.set_last_edit(datetime.now())
        person.set_firstname("Vorname noch nachtragen")
        person.set_lastname("Nachname noch nachtragen")
        person.set_username(username)
        person.set_mailaddress(mailaddress)
        person.set_firebase_id(firebase_id)
        person.set_deleted(0)

        with PersonMapper() as mapper:
            return mapper.insert(person), self.create_work_time_account_for_person(person)

    def delete_person(self, person):
        """Gegebene Person aus System löschen, gleichzeitig Person als Mitarbeiter in den Projekten streichen, in denen
         sie beteiligt war und ihr Arbeitszeitkonto löschen."""
        # noch Projektarbeiten und Buchungen von davon, die auf Arbeitszeitkonto sind löschen?
        with PersonMapper() as mapper:
            if person is not None:
                projects = self.get_projectmember_by_person(person)
                worktimeaccount = self.get_work_time_account_of_owner(person)

                for project in projects:
                    self.delete_project_member(project)

                self.delete_work_time_account(worktimeaccount)

            mapper.delete(person)

    def save_person(self, person):
        """Die gegebene Person speichern."""
        person.set_last_edit(datetime.now())
        with PersonMapper() as mapper:
            mapper.update(person)

    def get_person_by_firebase_id(self, id):
        """Den Benutzer mit der gegebenen Firebase ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_firebase_id(id)

    """Methoden für Kommen:"""

    def create_arrive_event(self, person):
        """Arrive-Ereignis anlegen"""
        arrive = Arrive()
        arrive.set_id(1)
        arrive.set_deleted(0)
        arrive.set_time_stamp(datetime.now())
        arrive.set_last_edit(datetime.now())
        arrive.set_affiliated_person(person.get_id())

        with ArriveMapper() as mapper:
            return mapper.insert(arrive), self.create_event_transaction(None, arrive, None)

    def delete_arrive_event(self, arrive):
        """Das gegebene Kommen Ereignis aus dem System löschen."""
        with ArriveMapper() as mapper:
            mapper.delete(arrive)

    def save_arrive_event(self, arrive):
        """Eine Kommen-Instanz speichern."""
        arrive.set_last_edit(datetime.now())
        with ArriveMapper() as mapper:
            mapper.update(arrive)

    def get_arrive_event_by_id(self, number):
        """Das Start-Ereignis mit der gegebenen ID auslesen"""
        with ArriveMapper() as mapper:
            return mapper.find_by_key(number)

    def get_arrive_events_by_affiliated_person(self, person):
        """Die Start-Ereignisse mit der gegebenen zugehörigen Personen ID auslesen"""
        with ArriveMapper() as mapper:
            if person is not None:
                return mapper.find_by_affiliated_person_id(person.get_id())
            else:
                return None

    def get_last_arrive_by_person(self, person):
        """Das lezte Kommen einer Person zurückgeben."""
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
        departure.set_deleted(0)
        departure.set_last_edit(datetime.now())
        departure.set_time_stamp(datetime.now())
        departure.set_affiliated_person(person.get_id())

        with DepartureMapper() as mapper:
            return mapper.insert(departure), self.create_event_transaction(None, None, departure), \
                   self.create_time_interval_for_arrive_and_departure(person)  # self.calculate_work_time(person)

    def delete_departure_event(self, departure):
        """Das gegebene End-Ereignis aus unserem System löschen."""
        with DepartureMapper() as mapper:
            mapper.delete(departure)

    def save_departure_event(self, departure):
        """Eine End-Ereignis-Instanz speichern."""
        departure.set_last_edit(datetime.now())
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
        """Das lezte Gehen einer Person zurückgeben."""
        with DepartureMapper() as mapper:
            if person is not None:
                return mapper.find_last_departure_by_person(person.get_id())
            else:
                return None

    def get_all_departure_events(self):
        """Alle in der Datenbank gespeicherten End-Ereignisse auslesen."""
        with DepartureMapper() as mapper:
            return mapper.find_all()

    def check_arrive_and_departure_for_person(self, person):
        """Überprüfen, ob Gehen größer als Kommen, also ob eingestelmpelt werden muss."""
        if person is not None:
            last_arrive = self.get_last_arrive_by_person(person)
            last_departure = self.get_last_departure_by_person(person)
            if last_arrive is None:  # wenn sich die Person zum ersten Mal anmeldet
                return True
            elif last_arrive is not None and last_departure is None:
                # wenn die Person ein Kommen aber noch kein Gehen hat, soll Dialog im Frontend nicht angezeigt werden
                return False
            else:
                last_arrive_time = last_arrive.get_time_stamp()
                last_departure_time = last_departure.get_time_stamp()
                if last_departure_time > last_arrive_time:
                    result = True
                else:
                    result = False
            return result

    def get_arrive_and_departure_of_person_between_time_stamps(self, person, start_time, end_time):
        # kann eventuell noch raus, war ursprünglich für worktimeaccount vorgesehen
        """Alle Kommen und Gehen einer Person in einem bestimmten Zeitraum ausgeben"""
        event_list = []
        time_stamp = None
        start_time = datetime.strptime(start_time, '%d/%m/%Y')
        end_time = datetime.strptime(end_time, '%d/%m/%Y')
        # Übergebene Time-Stamps von Str in Datetime konvertieren
        work_time_account = self.get_work_time_account_of_owner(person)
        events = self.get_event_transaction_by_affiliated_work_time_account_id(work_time_account.get_id())
        # Alle Eventtransaktionen von einem Arbeitszeitkonto speichern
        for e in events:
            arrive_id = e.get_arrive()
            departure_id = e.get_departure()
            # Wenn das Event kein Arrive oder Departure ist, bleibt ID None und Event wird nicht behandelt
            if arrive_id is not None:
                arrive = self.get_arrive_event_by_id(arrive_id)
                time_stamp = arrive.get_time_stamp()
                if start_time <= time_stamp <= end_time:
                    # Überprüfen, ob das Event im übergebenen Zeitraum liegt
                    event_list.append(e)
            if departure_id is not None:
                departure = self.get_departure_event_by_id(departure_id)
                time_stamp = departure.get_time_stamp()
                if start_time <= time_stamp <= end_time:
                    # Überprüfen, ob das Event im übergebenen Zeitraum liegt
                    event_list.append(e)
        return event_list

    """Methoden für Aktivität:"""

    def create_activity_for_project(self, name, capacity, project):
        """Aktivität anlegen"""
        with ActivityMapper() as mapper:
            if project is not None:
                activity = Activity()
                activity.set_id(1)
                activity.set_deleted(0)
                activity.set_last_edit(datetime.now())
                activity.set_name(name)
                activity.set_capacity(capacity)
                activity.set_affiliated_project(project.get_id())
                activity.set_work_time(0)

                return mapper.insert(activity)
            else:
                return None

    def delete_activity(self, activity):
        """Die gegebene Aktivität aus unserem System löschen."""
        with ActivityMapper() as mapper:
            if activity is not None:
                project_works = self.get_project_works_of_activity(activity)

                for project_work in project_works:
                    self.delete_project_work(project_work)

                return mapper.delete(activity)
            else:
                return None

    def save_activity(self, activity):
        """Eine Aktivitäts-Instanz speichern."""
        activity.set_last_edit(datetime.now())
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

    def calculate_work_time_of_activity(self, activity):
        """Die für eine Aktivität gearbeitete Zeit anhand der gebuchten Projektarbeiten berechnen"""
        time_interval_transactions = self.get_all_time_interval_transactions()
        work_time = timedelta(hours=0)
        for time_interval_transaction in time_interval_transactions:
            project_work_id = time_interval_transaction.get_affiliated_projectwork()
            if project_work_id is not None:
                project_work = self.get_project_work_by_id(project_work_id)
                if project_work is not None:
                    if project_work.get_affiliated_activity() == activity.get_id():
                        work_time += project_work.get_time_period()
        activity.set_work_time(work_time)
        self.save_activity(activity)

    def get_work_time_of_activity_between_two_dates(self, activity, start_time, end_time):
        """Die für eine Aktivität gearbeitete Zeit innerhalb eines bestimmten Zeitraums anhand der gebuchten
        Projektarbeiten berechnen"""
        time_interval_transactions = self.get_all_time_interval_transactions()
        work_time = timedelta(hours=0)
        for time_interval_transaction in time_interval_transactions:
            project_work_id = time_interval_transaction.get_affiliated_projectwork()

            if project_work_id is not None:  # wenn sich die Zeitintervallbuchung auf eine Projekarbeit bezieht
                project_work = self.get_project_work_by_id(project_work_id)

                if project_work.get_affiliated_activity() == activity.get_id():

                    start_e_pw = self.get_event_by_id(project_work.get_start_event())
                    end_e_pw = self.get_event_by_id(project_work.get_end_event())
                    start_time_pw = start_e_pw.get_time_stamp()
                    end_time_pw = end_e_pw.get_time_stamp()

                    if start_time_pw >= start_time and end_time_pw <= end_time:
                        work_time += project_work.get_time_period()

        return work_time

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
        event_transaction.set_last_edit(datetime.now())
        with EventTransactionMapper() as mapper:
            mapper.update(event_transaction)

    def delete_event_transaction(self, event_transaction):
        """Die gegebene EventTransaction löschen."""
        with EventTransactionMapper() as mapper:
            mapper.delete(event_transaction)

    def create_event_transaction(self, event=None, arrive=None, departure=None):
        """EventTransaction erstellen, je nach Übergabe für Event von Pause oder Projektarbeit oder Kommen und Gehen."""
        with EventTransactionMapper() as mapper:
            if event is not None:
                et = EventTransaction()
                et.set_id(1)
                et.set_deleted(0)
                et.set_last_edit(datetime.now())
                person = self.get_person_by_id(event.get_affiliated_person())
                et.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                et.set_event(event.get_id())
                return mapper.insert(et)
            elif arrive is not None:
                et = EventTransaction()
                et.set_id(1)
                et.set_deleted(0)
                et.set_last_edit(datetime.now())
                person = self.get_person_by_id(arrive.get_affiliated_person())
                et.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                et.set_arrive(arrive.get_id())
                return mapper.insert(et)
            elif departure is not None:
                et = EventTransaction()
                et.set_id(1)
                et.set_deleted(0)
                et.set_last_edit(datetime.now())
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

    def get_time_interval_transaction_by_affiliated_work_time_account_id(self, affiliated_work_time_account):
        """Die TimeIntervalTransaction mit der gegebenen WorkTimeAccount-ID auslesen."""
        with TimeIntervalTransactionMapper() as mapper:
            return mapper.find_by_affiliated_work_time_account_id(affiliated_work_time_account.get_id())

    def save_time_interval_transaction(self, time_interval_transaction):
        """Die gegebene TimeIntervalTransaction speichern."""
        time_interval_transaction.set_last_edit(datetime.now())
        with TimeIntervalTransactionMapper() as mapper:
            mapper.update(time_interval_transaction)

    def delete_time_interval_transaction(self, time_interval_transaction):
        """Die gegebene TimeIntervalTransaction löschen."""
        with TimeIntervalTransactionMapper() as mapper:
            if time_interval_transaction is not None:

                project_work_id = time_interval_transaction.get_affiliated_projectwork()
                break_id = time_interval_transaction.get_affiliated_break()

                if project_work_id is not None:
                    project_work = self.get_project_work_by_id(project_work_id)
                    self.delete_project_work(project_work)

                if break_id is not None:
                    br = self.get_break_by_id(break_id)
                    self.delete_break(br)

                mapper.delete(time_interval_transaction)

    def create_time_interval_transaction(self, person, time_interval=None, affiliated_break=None,
                                         projectwork=None):
        """Eine TimeIntervalTransaction erstellen, je nach Übergabewert wird Buchung für Arbeitszeit, Pause oder
        Projektarbeit erstellt."""
        with TimeIntervalTransactionMapper() as mapper:
            if time_interval and person is not None:
                t = TimeIntervalTransaction()
                t.set_id(1)
                t.set_deleted(0)
                t.set_last_edit(datetime.now())
                t.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                t.set_affiliated_time_interval(time_interval.get_id())
                return mapper.insert(t)
            elif affiliated_break and person is not None:
                t = TimeIntervalTransaction()
                t.set_id(1)
                t.set_deleted(0)
                t.set_last_edit(datetime.now())
                t.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                t.set_affiliated_break(affiliated_break.get_id())
                return mapper.insert(t)
            elif projectwork and person is not None:
                t = TimeIntervalTransaction()
                t.set_id(1)
                t.set_deleted(0)
                t.set_last_edit(datetime.now())
                t.set_affiliated_work_time_account(self.get_work_time_account_of_owner(person).get_id())
                t.set_affiliated_projectwork(projectwork.get_id())
                return mapper.insert(t)
            else:
                return None

    def get_intervals_of_person_between_time_stamps(self, person, start_time, end_time):
        """Alle Intervalle einer Person in einem bestimmten Zeitraum ausgeben"""
        event_dict = {}
        event_list = []
        time_stamp = None
        # start_time = datetime.strptime(start_time, '%d/%m/%Y')
        # end_time = datetime.strptime(end_time, '%d/%m/%Y')
        # Übergebene Time-Stamps von Str in Datetime konvertieren
        work_time_account = self.get_work_time_account_of_owner(person)
        time_interval_transactions = self.get_time_interval_transaction_by_affiliated_work_time_account_id(
            work_time_account)
        # Alle Timeintervaltransaktionen von einem Arbeitszeitkonto speichern
        event_transactions = self.get_event_transaction_by_affiliated_work_time_account_id(work_time_account.get_id())
        # Alle Eventtransaktionen von einem Arbeitszeitkonto speichern
        for e in event_transactions:
            arrive_id = e.get_arrive()
            departure_id = e.get_departure()
            # Wenn das Event kein Arrive oder Departure ist, bleibt ID None und Event wird nicht behandelt
            if arrive_id is not None:
                arrive = self.get_arrive_event_by_id(arrive_id)
                time_stamp = arrive.get_time_stamp()
                if start_time <= time_stamp.date() <= end_time:
                    # Überprüfen, ob das Event im übergebenen Zeitraum liegt
                    event_dict = {'name': 'Kommen','arriveid': arrive_id , 'departureid': None,'projectworkid': None,
                                  'start_time': time_stamp, 'starteventid': None, 'endtime': None, 'endeventid': None,
                                  'period': None, 'timeintervaltransactionid': None}
                    event_list.append(event_dict)
            if departure_id is not None:
                departure = self.get_departure_event_by_id(departure_id)
                time_stamp = departure.get_time_stamp()
                if start_time <= time_stamp.date() <= end_time:
                    # Überprüfen, ob das Event im übergebenen Zeitraum liegt
                    event_dict = {'name': 'Gehen', 'arriveid': None, 'departureid': departure_id, 'projectworkid': None,
                                  'start_time': time_stamp, 'starteventid': None,'endtime': time_stamp,
                                  'endeventid': None, 'period': None, 'timeintervaltransactionid': None}
                    event_list.append(event_dict)
        for tit in time_interval_transactions:
            break_id = tit.get_affiliated_break()
            project_work_id = tit.get_affiliated_projectwork()
            work_time_id = tit.get_affiliated_time_interval()
            if break_id is not None:
                br = self.get_break_by_id(break_id)
                start_event_id = br.get_start_event()
                start_event = self.get_event_by_id(start_event_id)
                end_event_id = br.get_end_event()
                end_event = self.get_event_by_id(end_event_id)
                time_stamp_start = start_event.get_time_stamp()
                time_stamp_end = end_event.get_time_stamp()
                time_period = br.get_time_period()
                if start_time <= time_stamp_start.date() <= end_time and start_time <= time_stamp_end.date() <= end_time:
                    event_dict = {'name': 'break', 'arriveid': None, 'departureid': None,'projectworkid': None,
                                  'start_time': time_stamp_start, 'starteventid': start_event_id,'endtime': time_stamp_end,
                                  'endeventid': end_event_id, 'period': time_period, 'timeintervaltransactionid': tit.get_id()}
                    event_list.append(event_dict)
            if project_work_id is not None:
                project_work = self.get_project_work_by_id(project_work_id)
                start_event_id = project_work.get_start_event()
                start_event = self.get_event_by_id(start_event_id)
                end_event_id = project_work.get_end_event()
                end_event = self.get_event_by_id(end_event_id)
                time_stamp_start = start_event.get_time_stamp()
                time_stamp_end = end_event.get_time_stamp()
                time_period = project_work.get_time_period()
                if start_time <= time_stamp_start.date() <= end_time and start_time <= time_stamp_end.date() <= end_time:
                    event_dict = {'name': project_work.get_project_work_name(),  'arriveid': None, 'departureid': None,
                                  'projectworkid': project_work_id, 'start_time': time_stamp_start, 'starteventid': start_event_id,
                                  'endtime': time_stamp_end,'endeventid': end_event_id,
                                  'period': time_period, 'timeintervaltransactionid': tit.get_id()}
                    event_list.append(event_dict)
            if work_time_id is not None:
                time_interval = self.get_time_interval_by_id(work_time_id)
                start_event_id = time_interval.get_start_event()
                start_event = self.get_event_by_id(start_event_id)
                end_event_id = time_interval.get_end_event()
                end_event = self.get_event_by_id(end_event_id)
                time_stamp_start = start_event.get_time_stamp()
                time_stamp_end = end_event.get_time_stamp()
                time_period = time_interval.get_time_period()
                if start_time <= time_stamp_start.date() <= end_time and start_time <= time_stamp_end.date() <= end_time:
                    event_dict = {'name': 'Arbeitszeit',  'arriveid': None, 'departureid': None,'projectworkid': None,
                                  'start_time': time_stamp_start, 'starteventid': start_event_id, 'endtime': time_stamp_end,
                                  'endeventid': end_event_id, 'period': time_period, 'timeintervaltransactionid': tit.get_id()}
                    event_list.append(event_dict)
        sorted_event_list = sorted(event_list, key=lambda x: x['start_time'])
        return sorted_event_list

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
                work_time_account.set_deleted(0)
                work_time_account.set_last_edit(datetime.now())
                work_time_account.set_owner(person.get_id())

                return mapper.insert(work_time_account)
            else:
                return None

    def save_work_time_account(self, work_time_account):
        work_time_account.set_last_edit(datetime.now())
        with WorkTimeAccountMapper() as mapper:
            mapper.update(work_time_account)

    def delete_work_time_account(self, work_time_account):
        """Arbeitszeitkonto löschen"""
        with WorkTimeAccountMapper() as mapper:
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
                project.set_deleted(0)
                project.set_last_edit(datetime.now())
                project.set_project_name(project_name)
                project.set_client(client)
                interval = self.get_max_time_interval_for_project()
                project.set_time_interval_id(interval.get_id())
                project.set_owner(person.get_id())

                return mapper.insert(project), self.create_project_member_for_project(project, person)
                # Nachdem das Projekt erstellt wurde, wird direkt der Ersteller als Projektmitglied hinzugefügt
            else:
                return None

    def delete_project(self, project):
        """Löschen eines Projekts, wenn darin Aktivitäten liegen, werden sie auch gelöscht."""
        with ProjectMapper() as mapper:
            if project is not None:
                activities = self.get_activities_of_project(project)
                pro_members = self.get_project_members_by_project(project)
                time_int_id = project.get_time_interval_id()
                time_int = self.get_time_interval_by_id(time_int_id)
                start_event_id = time_int.get_start_event()
                end_event_id = time_int.get_end_event()
                start_event = self.get_event_by_id(start_event_id)
                end_event = self.get_event_by_id(end_event_id)

                for activity in activities:
                    self.delete_activity(activity)

                for projectmember in pro_members:
                    self.delete_project_member(projectmember)

                if time_int is not None:
                    self.delete_time_interval(time_int)

                if start_event is not None:
                    self.delete_event(start_event)

                if end_event is not None:
                    self.delete_event(end_event)

                mapper.delete(project)
            else:
                return None

    def save_project(self, project):
        project.set_last_edit(datetime.now())
        with ProjectMapper() as mapper:
            return mapper.update(project)

    def get_project_by_person_id(self, person_id):
        """ ProjektWorks werden anhand der eindeutigen ID der Aktivität ausgelesen, der sie zugeordnet sind."""
        with ProjectMapper() as mapper:
            if not (person_id is None):
                return mapper.find_by_person_id(person_id)

    def get_projects_by_owner(self, owner):
        """Gibt alle Projekte zurück, in denen übergebene Person Projektleiter ist zurück"""
        with ProjectMapper() as mapper:
            if owner is not None:
                return mapper.find_projects_by_owner(owner.get_id())
            else:
                return None

    def calculate_work_time_of_project(self, project):
        """Die für ein Projekt gearbeitete Zeit berechnen"""
        activities = self.get_all_activities()
        work_time = timedelta(hours=0)
        for activity in activities:
            if activity.get_affiliated_project() == project.get_id():
                work_time += activity.get_work_time()
        project.set_work_time(work_time)
        self.save_project(project)

    def get_work_time_of_project_between_two_dates(self, project, start_time, end_time):
        """Die für ein Projekt gearbeitete Zeit innerhalb eines bestimmten Zeitraums anhand der gebuchten
        Projektarbeiten berechnen"""
        activities = self.get_all_activities()
        work_time = timedelta(hours=0)
        for activity in activities:
            if activity.get_affiliated_project() == project.get_id():
                work_time += self.get_work_time_of_activity_between_two_dates(activity, start_time, end_time)
        return work_time

    """ProjectWork Methoden"""

    def get_project_work_by_id(self, number):
        """Die Projektarbeit wird anhand ihrer eindeutigen ID ausgelesen."""
        with ProjectWorkMapper() as mapper:
            return mapper.find_by_key(number)

    def get_project_works_of_activity(self, activity):
        """ Projektarbeiten werden anhand der eindeutigen ID der Aktivität ausgelesen, der sie zugeordnet sind."""
        with ProjectWorkMapper() as mapper:
            result = []

            if not (activity is None):
                project_works = mapper.find_by_activity(activity.get_id())
                if not (project_works is None):
                    result.extend(project_works)
            return result

    def get_project_work_by_start_event(self, start_event):
        """Projektarbeit anhand der ID des Start Events ausgeben"""
        if start_event is not None:
            with ProjectWorkMapper() as mapper:
                return mapper.find_by_start_event(start_event.get_id())

    def get_all_project_works(self):
        """Gibt alle Projektarbeiten zurück"""
        with ProjectWorkMapper() as mapper:
            return mapper.find_all()

    def create_project_work(self, project_work_name, description, activity, person):
        """Erstellen einr neuen Projektarbeit"""
        with ProjectWorkMapper() as mapper:
            if activity and person is not None:
                project_work = ProjectWork()
                project_work.set_id(1)
                project_work.set_deleted(0)
                project_work.set_last_edit(datetime.now())
                project_work.set_project_work_name(project_work_name)
                project_work.set_description(description)
                project_work.set_affiliated_activity(activity.get_id())
                project_work.set_start_event(self.get_last_start_event_project_work(person).get_id())
                # project_work.set_end_event(self.get_last_end_event_project_work(person).get_id())
                # project_work.set_time_period(self.calculate_period(project_work))

                project = self.get_project_by_id(activity.get_affiliated_project())  # das Projekt der Aktität speichern

                return mapper.insert(project_work)
            else:
                return None

    def add_end_event_to_project_work(self, project_work, person):
        """Einer Projektarbeit ein End Event hinzufügen und die Zeit der PA berechnen"""
        with ProjectWorkMapper() as mapper:
            if project_work and person is not None:
                project_work.set_end_event(self.get_last_end_event_project_work(person).get_id())
                project_work.set_time_period(self.calculate_period(project_work))
                activity = self.get_activity_by_id(project_work.get_affiliated_activity())
                project = self.get_project_by_id(activity.get_affiliated_project())

            return mapper.update(project_work), self.create_time_interval_transaction(person, None, None, project_work), \
                   self.calculate_work_time_of_activity(activity), self.calculate_work_time_of_project(project)

    def delete_project_work(self, project_work):
        """Löschen einer Projektarbeit"""
        with ProjectWorkMapper() as mapper:
            return mapper.delete(project_work)

    def save_project_work(self, project_work):
        """Eine Projektarbeit speichern"""
        project_work.set_last_edit(datetime.now())
        with ProjectWorkMapper() as mapper:
            return mapper.update(project_work)

    def calculate_sum_of_project_work_by_person(self, person):
        # kann eventuell noch raus, wird nicht verwendet
        time_periods = []
        projects = self.get_project_by_person_id(person.get_id())
        for p in projects:
            ac = self.get_activities_of_project(p)
            for a in ac:
                act = self.get_activity_by_id(a.get_id())
                project_works = self.get_project_works_of_activity(act)
                for pw in project_works:
                    time_period = pw.get_time_period()
                    time_periods.append(time_period)
        sum_periods = sum(time_periods, timedelta())
        return sum_periods

    """ProjectMember Methoden"""

    def get_project_member_by_id(self, number):
        """Das Projekt wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectMemberMapper() as mapper:
            return mapper.find_by_key(number)

    def get_project_member_by_person_id(self, number):
        """Das Projekt wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectMemberMapper() as mapper:
            return mapper.find_by_person_id(number)

    def get_project_member_by_person(self, person):
        """Alle Projekte, in denen eine Person Mitglied ist ausgeben"""
        with ProjectMemberMapper() as mapper:
            result = []

            if not (person is None):
                project_member = mapper.find_projects_by_person_id(person.get_id())
                if not (project_member is None):
                    result.extend(project_member)
                return result

    def get_project_members_by_project(self, project):
        """ Projektarbeiten werden anhand der eindeutigen ID der Aktivität ausgelesen, der sie zugeordnet sind."""
        with ProjectMemberMapper() as mapper:
            return mapper.find_project_members_by_project_id(project.get_id())


    def create_project_member_for_project(self, project, person):
        """Erstellen eines neuen Projekts"""
        with ProjectMemberMapper() as mapper:
            if project and person is not None:
                project_member = ProjectMember()
                project_member.set_id(1)
                project_member.set_deleted(0)
                project_member.set_last_edit(datetime.now())
                project_member.set_project(project.get_id())
                project_member.set_person(person.get_id())

                return mapper.insert(project_member)
            else:
                return None

    def delete_project_member(self, project_member):
        with ProjectMemberMapper() as mapper:
            return mapper.delete(project_member)

    def delete_project_member_by_id(self, person, project):
        with ProjectMemberMapper() as mapper:
            return mapper.delete_by_ids(person, project)

    def save_project_member(self, project_member):
        # Vor dem Speichern wird der last_edit zu aktuellen Zeitpunkt gesetzt
        project_member.set_last_edit(datetime.now())
        with ProjectMemberMapper() as mapper:
            return mapper.update(project_member)

    def get_project_by_employee(self, person_id):
        with ProjectMemberMapper() as mapper:
            return mapper.find_projects_by_person_id(person_id)

    def get_persons_who_are_not_project_member(self, project):
        with PersonMapper() as mapper:
            return mapper.find_persons_by_project_id(project.get_id())

    """Methoden von TimeInterval"""

    def calculate_period(self, timeinterval):
        """Berechnen des Zeitraumes eines Zeitintervalls"""
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

    def calculate_work_time(self, person):
        # kann eventuell noch raus, berechnen ja jetzt die Arbeitszeit immer zwischen zwei Projektarbeiten/Pausen
        """Arbeitszeit einer Person an einem Tag berechnen,
        Zeit zwischen Kommen und Gehen minus Projektarbeiten und Pausen"""
        if person is not None:
            last_arrive_of_person = self.get_last_arrive_by_person(person)
            # das lezte Kommen Event der Person, da für diesen Tag die Arbeitszeit berechnet werden soll
            time_interval = self.get_time_interval_by_arrive_id(last_arrive_of_person.get_id())
            # Zeitintervall von Kommen bis Gehen
            full_work_time = time_interval.get_time_period()
            # komplette Zeit zwischen Kommen und Gehen
            work_time = timedelta(hours=0)
            events = self.get_all_events_by_person(person)
            # alle Events der Person, da unten überprüft wird, ob Event nach Kommen erstellt wurde
            for event in events:
                event_type = event.get_event_type()
                if event_type == 3:  # Start einer Pause
                    event_time_stamp = event.get_time_stamp()
                    if event_time_stamp > last_arrive_of_person.get_time_stamp():  # wenn Event nach Kommen kommt
                        pw = self.get_break_by_start_event(event)  # Pausenobjekt zu Pausenstartevent
                        break_time = pw.get_time_period()
                        work_time = full_work_time - break_time  # Pausenzeit von der kompletten Zeit abgezogen
                if event_type == 1:  # Start einer Projektarbeit
                    event_time_stamp = event.get_time_stamp()
                    if event_time_stamp > last_arrive_of_person.get_time_stamp():  # wenn Event nach Kommen kommt
                        pw = self.get_project_work_by_start_event(event)  # Projektarbeitsobjekt zu Startevent
                        project_work_time = pw.get_time_period()
                        work_time = full_work_time - project_work_time  # Zeit von der kompletten Zeit abgezogen
            return work_time, self.create_time_interval_for_work_time(work_time, person)
            # für berechnete Arbeitszeit ein Zeitintervall anhand der berechneten Zeitperiode erstellen

    def create_time_interval(self, start_event, end_event):
        """Zeitinterval anlegen"""
        with TimeIntervalMapper() as mapper:
            if start_event and end_event is not None:
                interval = TimeInterval()
                interval.set_id(1)
                interval.set_deleted(0)
                interval.set_last_edit(datetime.now())
                interval.set_start_event(start_event.get_id())
                if end_event is not None:
                    interval.set_end_event(end_event.get_id())
                    interval.set_time_period(self.calculate_period(interval))

                return mapper.insert(interval)
            else:
                return None

    def create_time_interval_for_work_time(self, time_period, person):
        """Zeitintervall mit Periode aber ohne Ereignisse erstellen, um Zeitintervalle für Arbeitszeit zu erstellen"""
        with TimeIntervalMapper() as mapper:
            if time_period is not timedelta(hours=0) and person is not None:
                interval = TimeInterval()
                interval.set_id(1)
                interval.set_deleted(0)
                interval.set_last_edit(datetime.now())
                interval.set_time_period(time_period)
                return mapper.insert(interval), self.create_time_interval_transaction(person, interval, None, None)
            # Zeitintervall Buchung für Arbeitszeit erstellen
            else:
                return None

    def create_time_interval_for_arrive_and_departure(self, person):
        """Zeitintervall erstellen, das die Zeit zwischen Kommen und Gehen einer Person speichert"""
        with TimeIntervalMapper() as mapper:
            if person is not None:
                interval = TimeInterval()
                interval.set_id(1)
                interval.set_deleted(0)
                interval.set_last_edit(datetime.now())
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

    def get_time_interval_by_arrive_id(self, number):
        """Timeinterval suchen über gegebene Arrive ID"""
        with TimeIntervalMapper() as mapper:
            return mapper.find_by_arrive_id(number)

    def get_max_time_interval_for_project(self):
        """Zeitinterval für ein Projekt suchen """
        with TimeIntervalMapper() as mapper:
            return mapper.find_by_max_id_for_project()

    def save_time_interval(self, value):
        value.set_last_edit(datetime.now())
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
        sum_periods = sum(time_periods, timedelta())
        return sum_periods

    """Methoden für Pause"""

    def create_break(self, person):
        """Erstellen einer neuen Pause"""
        with BreakMapper() as mapper:
            if person is not None:
                br = Break()
                br.set_id(1)
                br.set_deleted(0)
                br.set_last_edit(datetime.now())
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
        """Pause nach nach übergebener Id zurückgeben"""
        with BreakMapper() as mapper:
            return mapper.find_by_key(number)

    def get_break_by_start_event(self, start_event):
        """Pause nach übergebener Id des Start Events zurückgeben"""
        if start_event is not None:
            with BreakMapper() as mapper:
                return mapper.find_by_start_event_id(start_event.get_id())

    def save_break(self, value):
        value.set_last_edit(datetime.now())
        with BreakMapper() as mapper:
            return mapper.update(value)

    def check_break(self, person):
        """Überprüfen, ob eine Pause begonnen wurde."""
        if person is not None:
            last_event = self.get_last_event_by_affiliated_person(person)
            if last_event is None:  # wenn die Person neu im System ist, wird Pause starten angezeigt
                return True
            if last_event.get_event_type() == 3:
                result = True
            else:
                result = False
            return result

    """Methoden von Event"""

    def check_time_difference_events(self, event_type, person):
        """Zeitunterschied zwischen Events berechnen, um Arbeitszeit zu ermitteln"""
        if person is not None:
            if event_type == 1 or event_type == 3:
                last_event = self.get_last_event_by_affiliated_person(person)
                if last_event is not None:
                    time_stamp = last_event.get_time_stamp()
                    time_difference = datetime.now() - time_stamp
                    if time_difference > timedelta(minutes=2):
                        work_time_start = self.create_event_with_time_stamp(5, time_stamp, person)
                        self.create_event_transaction(work_time_start, None, None)
                        work_time_end = self.create_event(6, person)[0]
                        work_time = self.create_time_interval(work_time_start, work_time_end)
                        self.create_time_interval_transaction(person, work_time)
        return self.create_event_and_check_type(event_type, person)

    def create_event(self, event_type, person):
        """Event anlegen"""
        with EventMapper() as mapper:
            if person is not None:
                event = Event()
                event.set_id(1)
                event.set_deleted(0)
                event.set_last_edit(datetime.now())
                event.set_event_type(event_type)
                event.set_time_stamp(datetime.now())
                event.set_affiliated_person(person.get_id())
                return mapper.insert(event), self.create_event_transaction(event, None, None)
            else:
                return None

    def check_if_first_event(self, event_type, person):
        """Überprüfen, ob das anzulegende Event das erste der Person ist."""
        last_event = self.get_last_event_by_affiliated_person(person)
        if last_event is None:
            if event_type == 1 or event_type == 3:  # anlegen wenn Start einer Projektarbeit oder Pause, sonst nicht
                self.create_event(event_type, person)
            else:
                return None
        else:
            return self.check_time_difference_events(event_type, person)  # wenn es letztes Event gibt, dieses checken

    def create_event_and_check_type(self, event_type, person):
        """Überprüfen, ob das Event angelegt werden darf."""
        last_event = self.get_last_event_by_affiliated_person(person)
        event_type_last_event = last_event.get_event_type()
        if event_type == 1:
            if event_type_last_event == 2 or event_type_last_event == 4 or event_type == 6:
                self.check_time_difference_events(event_type, person)
        if event_type == 2:
            if event_type_last_event == 1:
                self.check_time_difference_events(event_type, person)
                start = self.get_last_start_event_project_work(person)
                pw = self.get_project_work_by_start_event(start)
                self.add_end_event_to_project_work(pw, person)
        if event_type == 3:
            if event_type_last_event == 2 or event_type_last_event == 4 or event_type_last_event == 6:
                self.check_time_difference_events(event_type, person)
        if event_type == 4:
            if event_type_last_event == 3:
                self.check_time_difference_events(event_type, person)
                self.create_break(person)

    def create_event_with_time_stamp(self, event_type, time_stamp, person=None):
        """Event mit Zeitpunkt erstellen"""
        with EventMapper() as mapper:
            if event_type and time_stamp is not None:
                event = Event()
                event.set_id(1)
                event.set_deleted(0)
                event.set_last_edit(datetime.now())
                event.set_event_type(event_type)
                event.set_time_stamp(time_stamp)
                if person is not None:
                    event.set_affiliated_person(person.get_id())
                return mapper.insert(event), self.create_time_interval_for_project_duration()
            else:
                return None

    def create_time_interval_for_project_duration(self):
        """Methode um ein TimeInterval zu erstellen, welches eine Projektlaufzeit für ein Projekt abbildet"""
        last_event = self.get_last_event_for_type_check()  # Hier wird der letzte EventType übergeben.

        if last_event[0] == 8:  # Hier wird abgefragt, ob der EventType = 8, also ein Projektende, ist.
            startevent = self.get_last_event_by_event_type(7)
            endevent = self.get_last_event_by_event_type(8)
            self.create_time_interval(startevent, endevent)
        else:
            pass

    def get_last_event_for_type_check(self):
        with EventMapper() as mapper:
            return mapper.find_last_event_type()

    def get_last_start_event_project_work(self, person):
        """Gibt das letzte Startevent für eine Projektarbeit einer bestimmten Person zurück"""
        with EventMapper() as mapper:
            if person is not None:
                return mapper.find_last_start_event_project_work(person.get_id())
            else:
                return None

    def get_last_end_event_project_work(self, person):
        """Gibt das letzte Endevent für eine Projektarbeit einer bestimmten Person zurück"""
        with EventMapper() as mapper:
            if person is not None:
                return mapper.find_last_end_event_project_work(person.get_id())
            else:
                return None

    def get_last_start_event_break(self, person):
        """Gibt das letzte Startevent für eine Pause einer bestimmten Person zurück"""
        with EventMapper() as mapper:
            if person is not None:
                return mapper.find_last_start_event_break(person.get_id())
            else:
                return None

    def get_last_end_event_break(self, person):
        """Gibt das letzte Endevent für eine Projektarbeit einer bestimmten Person zurück"""
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

    def get_last_event_by_event_type(self, event_type):
        """Das letzte Event anhand der zugehörigen Personen Id ausgeben."""
        with EventMapper() as mapper:
            if event_type is not None:
                return mapper.find_last_project_duration_event(event_type)
            else:
                return None

    def delete_event(self, event):
        """Das gegebene Event-Ereignis aus unserem System löschen."""
        with EventMapper() as mapper:
            mapper.delete(event)

    def save_event(self, event):
        """Eine Event-Instanz speichern."""
        event.set_last_edit(datetime.now())
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

    def get_all_events_by_person(self, person):
        """Gibt alle Events einer Person zurück"""
        if person is not None:
            with EventMapper() as mapper:
                return mapper.find_all_by_person_id(person.get_id())
        else:
            return None

    # Business Logik für Frontend
    def get_all_projects_by_person_id(self, person):
        projects = []
        projectmembers = self.get_project_member_by_person(person)
        for pm in projectmembers:
            project_id = pm.get_project()
            project = self.get_project_by_id(project_id)
            projects.append(project)
        return projects

    def check_time_for_departure(self):
        while True:
            time.sleep(60)
            persons = self.get_all_persons_by_arrive()
            for person in persons:
                arrive = self.get_last_arrive_by_person(person).get_time_stamp()
                datetime_now = datetime.now()
                working_time = datetime_now - arrive
                last_event = self.get_last_event_by_affiliated_person(person)
                if working_time >= timedelta(hours=10):
                    event_type = last_event.get_event_type()
                    if event_type == 1:
                        self.create_event_and_check_type(2, person)
                        self.create_event(2, person)
                        project_work = self.get_project_work_by_start_event(last_event)
                        self.add_end_event_to_project_work(project_work, person)
                    if event_type == 3:
                        self.create_event_and_check_type(4, person)
                        self.create_break(person)
                    self.create_departure_event(person)
