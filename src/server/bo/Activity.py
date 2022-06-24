from server.bo import BusinessObject as bo


class Activity (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._name = ''  # Der Name der Aktivität
        self._capacity = 0  # Kapazität in Personentagen
        self._affiliated_project = None  # Der Aktivität zugeordnetes Projekt
        self._work_time = 0  # Die für die Aktivität gearbeitete Zeit

    def get_name(self):
        """Auslesen des Namens."""
        return self._name

    def set_name(self, name):
        """Setzen des Namens."""
        self._name = name

    def get_capacity(self):
        """Auslesen des Namens."""
        return self._capacity

    def set_capacity(self, capacity):
        """Setzen des Namens."""
        self._capacity = capacity

    def get_affiliated_project(self):
        """Auslesen des Namens."""
        return self._affiliated_project

    def set_affiliated_project(self, affiliated_project):
        """Setzen des Namens."""
        self._affiliated_project = affiliated_project

    def get_work_time(self):
        """Auslesen der gearbeiteten Zeit."""
        return self._work_time

    def set_work_time(self, work_time):
        """Setzen der gearbeiteten Zeit."""
        self._work_time = work_time

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Activity: {}, {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self._name, self._capacity,
                                                         self._affiliated_project, self._work_time)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Start-Event()."""
        obj = Activity()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_name(dictionary["name"])
        obj.set_capacity(dictionary["capacity"])
        obj.set_affiliated_project(dictionary["affiliated_project"])
        obj.set_work_time(dictionary["work_time"])

        return obj
