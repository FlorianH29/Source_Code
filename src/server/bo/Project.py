from server.bo import BusinessObject as bo


class Project (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__project_name = ""    # The project_name of the project.
        self.__client = ""  # The name of the client.
        self.time_interval_id = None  # The project term is an object of TimeInterval

    def set_project_name(self, project_name):
        self.__project_name = project_name

    def get_project_name(self):
        return self.__project_name

    def set_client(self, client):
        self.__client = client

    def get_client(self):
        return self.__client

    def set_time_interval_id(self, timeinterval_id):
        self.time_interval_id = timeinterval_id

    def get_time_interval_id(self):
        return self.time_interval_id

    def __str__(self):
        """Ausgabe von: id, name, client, project_term_id"""
        return "Project: \n  id: {} \n  project_name: {} \n  client: {} \n  timeinterval_id: {}".format(
            self.get_id(), self.get_project_name(), self.get_client(), self.get_time_interval_id())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Project()."""
        project = Project()
        project.set_id(dictionary["id"])  # Usually part of the business object.
        project.set_project_name(dictionary["project_name"])  # Sets the name from the dict as the name of the object.
        project.set_last_edit("last_edit")  # Set the last edit of the project work.
        project.set_client(dictionary["client"])  # Sets the client from the dict as the client of the object.
        project.set_time_interval_id(dictionary["timeinterval_id"])  # Sets the client from the dict as the client of the object.
        return project
