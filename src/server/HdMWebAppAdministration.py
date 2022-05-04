from .bo.Person import Person
from .db.PersonMapper import PersonMapper


class HdMWebAppAdministration(object):

    def __init__(self):
        pass

    def get_person_by_id(self, number):
        """Den Benutzer mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_persons(self):
        with PersonMapper() as mapper:
            return mapper.find_all()

    def create_person(self, person):
        with PersonMapper as mapper:
            mapper.insert(person)