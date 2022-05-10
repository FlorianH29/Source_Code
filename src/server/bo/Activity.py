from server.bo import BusinessObject as bo


class Activity (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ''  # Der Name der Aktivität
        self.__capacity = 0  # Kapazität in Personentagen
        self.__affiliated_project = None  # Der Aktivität zugeordnetes Projekt

    def get_name(self):
        """Auslesen des Namens."""
        return self.__name

    def set_name(self, name):
        """Setzen des Namens."""
        self.__name = name

    def get_capacity(self):
        """Auslesen des Namens."""
        return self.__capacity

    def set_capacity(self, capacity):
        """Setzen des Namens."""
        self.__capacity = capacity

    def get_affiliated_project(self):
        """Auslesen des Namens."""
        return self.__affiliated_project

    def set_affiliated_project(self, affiliated_project):
        """Setzen des Namens."""
        self.__affiliated_project = affiliated_project

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Activity: {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self.__name, self.__capacity,
                                                     self.__affiliated_project)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Start-Event()."""
        obj = Activity()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_name(dictionary["name"])
        obj.set_capacity(dictionary["capacity"])
        obj.set_affiliated_project(dictionary["affiliated_project"])

        return obj
