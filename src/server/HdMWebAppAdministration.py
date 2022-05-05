from .bo.Person import Person
from .bo.Start import Start
from .bo.Activity import Activity
from .db.PersonMapper import PersonMapper
from .db.StartMapper import StartMapper
from .db.ActivityMapper import ActivityMapper


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
