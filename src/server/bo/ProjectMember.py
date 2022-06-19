from server.bo import BusinessObject as bo


class ProjectMember(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__project = ""
        self.__person = ""

    def get_project(self):
        return self.__project

    def set_project(self, value):
        self.__project = value

    def get_person(self):
        return self.__person

    def set_person(self, value):
        self.__person = value

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "ProjectMember: {}, {}, {}, {}".format(self.get_id(), self.__project,
                                                      self.__person, self.get_last_edit())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Departure-Event()."""
        projectmember = ProjectMember()
        projectmember.set_id(dictionary["id"])
        projectmember.set_last_edit(dictionary["last_edit"])
        projectmember.set_project(dictionary["project_id"])
        projectmember.set_person(dictionary["person_id"])
        projectmember.set_deleted("deleted")

        return projectmember
