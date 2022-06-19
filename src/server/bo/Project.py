from server.bo import BusinessObject as bo


class Project (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._project_name = ""    # Bezeichnung des Projekts.
        self._client = ""  # Name des Auftraggebers.
        self._time_interval_id = None  # Id welche auf das zugehörige Zeitinterval verweist
        self._owner = None  # Projektleiter des Projekts
        self._work_time = 0  # Die für das Projekt gearbeitete Zeit

    def set_project_name(self, project_name):
        self._project_name = project_name

    def get_project_name(self):
        return self._project_name

    def set_client(self, client):
        self._client = client

    def get_client(self):
        return self._client

    def set_time_interval_id(self, timeinterval_id):
        self._time_interval_id = timeinterval_id

    def get_time_interval_id(self):
        return self._time_interval_id

    def set_owner(self, owner):
        self._owner = owner

    def get_owner(self):
        return self._owner

    def set_work_time(self, work_time):
        self._work_time = work_time

    def get_work_time(self):
        return self._work_time

    def __str__(self):
        """Ausgabe von: id, Projektname, Klient, project_term_id"""
        return "Project: {}, {}, {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self.get_project_name(),
                                                            self.get_client(), self.get_time_interval_id(),
                                                            self.get_owner(), self.get_work_time())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Project()."""
        project = Project()
        project.set_id(dictionary["id"])  # Usually part of the business object.
        project.set_project_name(dictionary["project_name"])  # Sets the name from the dict as the name of the object.
        project.set_last_edit("last_edit")  # Set the last edit of the project work.
        project.set_client(dictionary["client"])  # Sets the client from the dict as the client of the object.
        project.set_time_interval_id(dictionary["timeinterval_id"])  # Sets the client from the dict as the client of the object.
        project.set_work_time(dictionary["work_time"])
        return project
