from .bo.Person import Person
from .db.PersonMapper import PersonMapper
from .db.EventMapper import EventMapper


class HdMWebAppAdministration(object):

    def __init__(self):
        pass

    def get_person_by_id(self, number):
        """Den Benutzer mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_key(number)

    def get_event_by_id(self, number):
        """Das Ereignis mit der gegebenen ID auslesen"""
        with EventMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_events (self):
        """Alle in der Datenbank gespeicherten Events auslesen."""
        with EventMapper() as mapper:
            return mapper.find_all()
