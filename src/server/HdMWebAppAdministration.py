from .bo.Person import Person
from .bo.Start import Start
from .bo.Activity import Activity
from .db.PersonMapper import PersonMapper
from .db.StartMapper import StartMapper
from .db.ActivityMapper import ActivityMapper
from .bo.TimeIntervalTransaction import TimeIntervalTransaction
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
        """Die Person mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_key(number)

    def create_person(self, id, firstname, lastname, username, mailadress, last_edit, person_id):
        person = Person()
        person.set_person_id(person_id)
        person.set_id(id)
        person.set_firstname(firstname)
        person.set_lastname(lastname)
        person.set_mailaddress(mailadress)
        person.set_username(username)
        person.set_last_edit(last_edit)

        with PersonMapper as mapper:
            mapper.insert(person)

    def delete_person(self, person):
        "Gegebene Person aus System löschen"
        with PersonMapper() as mapper:
            mapper.delete(person)

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
        """Die gegebene Person aus unserem System löschen."""
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
        """Die EventTransaction mit der gegebenen EventTransaction-ID auslesen."""
        with EventTransactionMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_event_transactions (self):
        """Alle in der Datenbank gespeicherten EventTransactions auslesen."""
        with EventTransactionMapper() as mapper:
            return mapper.find_all()

    def get_event_transaction_by_affiliated_work_time_account_id(self, affiliated_work_time_account_id):
        """Die EventTransaction mit der gegebenen WorkTimeAccount-ID auslesen."""
        with EventTransactionMapper() as mapper:
            return mapper.find_by_affiliated_work_time_account_id(affiliated_work_time_account_id)

    def save_event_transaction(self, event_transaction):
        """Die gegebene EventTransaction speichern."""
        with EventTransactionMapper() as mapper:
            mapper.update(event_transaction)

    def delete_event_transaction(self, event_transaction):
        """Die gegebene EventTransaction löschen."""
        with EventTransactionMapper() as mapper:

            mapper.delete(event_transaction)

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
        with TimeIntervalTransactionMapper() as mapper:
            mapper.update(time_interval_transaction)

    def delete_time_interval_transaction(self, time_interval_transaction):
        """Die gegebene TimeIntervalTransaction löschen."""
        with TimeIntervalTransactionMapper() as mapper:
            mapper.delete(time_interval_transaction)

    def create_time_interval_transaction(self, id, last_edit, affiliated_work_time_account_id, time_interval):
        """Eine TimeIntervalTransaction erstellen."""
        t = TimeIntervalTransaction()
        t.set_id(id)
        t.set_last_edit(last_edit)
        t.set_affiliated_work_time_account(affiliated_work_time_account_id)
        t.set_time_interval(time_interval)

        with TimeIntervalTransactionMapper() as mapper:
            return mapper.insert(t)

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