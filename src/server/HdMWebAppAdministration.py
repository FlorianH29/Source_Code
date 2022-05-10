from .bo.Start import Start
from .bo.End import End
from .bo.Activity import Activity
from .db.PersonMapper import PersonMapper
from .db.StartMapper import StartMapper
from .db.EndMapper import EndMapper
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
        """Start-Ereignis anlegen"""
        start = Start()
        start.set_id(id)
        start.set_last_edit(last_edit)
        start.set_time_stamp(time_stamp)

        with StartMapper() as mapper:
            return mapper.insert(start)

    def delete_start(self, start):
        """Das gegebene Start-Ereignis aus unserem System löschen."""
        with StartMapper() as mapper:
            mapper.delete(start)

    def save_start(self, start):
        """Eine End-Ereignis-Instanz speichern."""
        with StartMapper() as mapper:
            mapper.update(start)

    def get_start_event_by_id(self, number):
        """Das Start-Ereignis mit der gegebenen ID auslesen"""
        with StartMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_start_events (self):
        """Alle in der Datenbank gespeicherten Start-Ereignisse auslesen."""
        with StartMapper() as mapper:
            return mapper.find_all()

    """Methoden für End:"""

    def create_end(self, id, last_edit, time_stamp):
        """End-Ereignis anlegen"""
        end = End()
        end.set_id(id)
        end.set_last_edit(last_edit)
        end.set_time_stamp(time_stamp)

        with EndMapper() as mapper:
            return mapper.insert(end)

    def delete_end(self, end):
        """Das gegebene End-Ereignis aus unserem System löschen."""
        with EndMapper() as mapper:
            mapper.delete(end)

    def save_end(self, end):
        """Eine End-Ereignis-Instanz speichern."""
        with EndMapper() as mapper:
            mapper.update(end)

    def get_end_event_by_id(self, number):
        """Das End-Ereignis mit der gegebenen ID auslesen"""
        with EndMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_end_events(self):
        """Alle in der Datenbank gespeicherten End-Ereignisse auslesen."""
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

    def delete_activity(self, activity):
        """Die gegebene Aktivität aus unserem System löschen."""
        with ActivityMapper() as mapper:
            mapper.delete(activity)

    def save_activity(self, activity):
        """Eine Aktivitäts-Instanz speichern."""
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
