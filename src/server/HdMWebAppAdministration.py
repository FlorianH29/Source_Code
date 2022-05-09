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

    """
    Project Methoden
    """
    def get_project_by_id(self, number):
        """Das Projekt wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_projects(self):
        with ProjectMapper() as mapper:
            return mapper.find_all()

    def insert_project(self):
        with ProjectMapper() as mapper:
            return mapper.insert()

    def delete_project(self):
        with ProjectMapper() as mapper:
            return mapper.delete()

    def update_project(self):
        with ProjectMapper() as mapper:
            return mapper.update()

    """
    ProjectWork Methoden
    """

    def get_projectwork_by_id(self, number):
        """Das ProjektWork wird anhand seiner eindeutigen ID ausgelesen."""
        with ProjectWorkMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_project_works(self):
        with ProjectWorkMapper() as mapper:
            return mapper.find_all()

    def insert_project_work(self):
        with ProjectWorkMapper() as mapper:
            return mapper.insert()

    def delete_project_work(self):
        with ProjectWorkMapper() as mapper:
            return mapper.delete()

    def update_project_work(self):
        with ProjectWorkMapper() as mapper:
            return mapper.update()
