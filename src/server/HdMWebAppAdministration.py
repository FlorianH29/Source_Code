from .bo.Person import Person
from .db.PersonMapper import PersonMapper
from .db.ProjectMapper import ProjectMapper
from .db.ProjectWorkMapper import ProjectWorkMapper


class HdMWebAppAdministration(object):

    def __init__(self):
        pass

    def get_person_by_id(self, number):
        """Den Benutzer mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_key(number)

    def get_project_by_id(self, number):
        """Das Projekt wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectMapper() as mapper:
            return mapper.find_by_key(number)

    def get_projectwork_by_id(self, number):
        """Das ProjektWork wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectWorkMapper() as mapper:
            return mapper.find_by_key(number)
