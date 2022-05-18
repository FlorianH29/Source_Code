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
        return "Event: {}, {}, {}".format(self.get_id(), self.get_last_edit(), self.__project, self.__person)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Departure-Event()."""
        obj = ProjectMember()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_project(dictionary["project_id"])
        obj.set_person(dictionary["person_id"])

        return obj
