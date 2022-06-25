from server.bo import BusinessObject as bo


class ProjectMember(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._project = None  # die id des zugehörigen Projekts
        self._person = None  # die id der zugehörigen Person

    def get_project(self):
        return self._project

    def set_project(self, project):
        self._project = project

    def get_person(self):
        return self._person

    def set_person(self, person):
        self._person = person

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "ProjectMember: {}, {}, {}, {}".format(self.get_id(), self._project,
                                                      self._person, self.get_last_edit())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Departure-Event()."""
        obj = ProjectMember()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_project(dictionary["project_id"])
        obj.set_person(dictionary["person_id"])

        return obj
