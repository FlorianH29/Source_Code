from .bo.Person import Person
from .bo.Start import Start
from .bo.Activity import Activity
from .db.PersonMapper import PersonMapper
from .db.StartMapper import StartMapper
from .db.ActivityMapper import ActivityMapper
from .db.TimeIntervalTransactionMapper import TimeIntervalTransactionMapper
from .db.EventTransactionMapper import EventTransactionMapper
from .bo.EventTransaction import EventTransaction
from .bo.WorkTimeAccount import WorkTimeAccount
from .db.WorkTimeAccountMapper import WorkTimeAccountMapper


class HdMWebAppAdministration(object):

    def __init__(self):
        pass

    """Methoden für Person:"""
    def get_person_by_id(self, number):
        """Den Benutzer mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_key(number)

    """Methoden für Start:"""

    def create_start(self, id, last_edit, time_stamp):
        """Start Event anlegen"""
        start = Start()
        start.set_id(id)
        start.set_last_edit(last_edit)
        start.set_time_stamp(time_stamp)

        with StartMapper() as mapper:
            return mapper.insert(start)

    def delete_start(self, start):
        """Den gegebenen Benutzer aus unserem System löschen."""
        with StartMapper() as mapper:
            mapper.delete(start)

    def get_start_event_by_id(self, number):
        """Das Ereignis mit der gegebenen ID auslesen"""
        with StartMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_start_events (self):
        """Alle in der Datenbank gespeicherten Events auslesen."""
        with StartMapper() as mapper:
            return mapper.find_all()

    """Methoden für Aktivität:"""

    def create_activity(self, id, last_edit, name, capacity, affiliated_project):
        """Aktivität anlegen"""
        activity = Activity()
        activity.set_id(id)
        activity.set_last_edit(last_edit)
        activity.set_name(name)
        activity.set_capacity(capacity)
        activity.set_affiliated_project(affiliated_project)

        with ActivityMapper() as mapper:
            return mapper.insert(activity)

    """Methoden für EventTransaktionen"""

    def get_event_transaction_by_id(self, number):
        """Die Buchung mit der gegebenen Buchungs-ID auslesen."""
        with EventTransactionMapper() as mapper:
            return mapper.find_by_key(number)

    def create_event_transaction(self, id, last_edit, affiliated_work_time_account_id, event):
        """Eine Buchung erstellen."""
        t = EventTransaction()
        t.set_id(id)
        t.set_last_edit(last_edit)
        t.set_affiliated_work_time_account(affiliated_work_time_account_id)
        t.set_event(event)

        with EventTransactionMapper() as mapper:
            return mapper.insert(t)

    """Methoden für TimeIntervalTransaktionen"""
    def get_time_interval_transaction_by_id(self, number):
        """Die Buchung mit der gegebenen Buchungs-ID auslesen."""
        with TimeIntervalTransactionMapper() as mapper:
            return mapper.find_by_key(number)

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

    def create_work_time_account(self, id, last_edit, user_id):
        """Arbeitszeitkonto anlegen"""
        work_time_account = WorkTimeAccount()
        work_time_account.set_id(id)
        work_time_account.set_last_edit(last_edit)
        work_time_account.set_owner(user_id)

        with WorkTimeAccountMapper() as mapper:
            return mapper.insert(work_time_account)

    def save_work_time_account(self, work_time_account):
        with WorkTimeAccountMapper as mapper:
            mapper.update(work_time_account)

    def delete_work_time_account(self, work_time_account):
        """Arbeitszeitkonto löschen"""
        with WorkTimeAccountMapper() as mapper:
            #wenn es transactions gibt, müssen die mit if abfrage gelöscht werden
            mapper.delete(work_time_account)