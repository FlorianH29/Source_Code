from server.bo import BusinessObject as bo


class Project (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""    # The name of the project.
        self.__client = ""  # The name of the client.
        self.__project_term_id = None  # The project term is an object of TimeInterval

    def set_name(self, name):
        self.__name = name

    def get_name(self):
        return self.__name

    def set_client(self, client):
        self.__client = client

    def get_client(self):
        return self.__client

    def set_project_term_id(self, project_term_id):
        self.__project_term_id = project_term_id

    def get_project_term_id(self):
        return self.__project_term_id


    def __str__(self):
        """Ausgabe von: id, name, client, project_term_id"""
        return "Project: \n  id: {} \n  name: {} \n  client: {} \n  project_term_id: {}".format(self.get_id(), self.get_name(), self.get_client(), self.get_project_term_id())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Project()."""
        project = Project()
        project.set_id(dictionary["id"])  # Usually part of the business object.
        project.set_name(dictionary["name"])  # Sets the name from the dict as the name of the object.
        project.set_last_edit("last_edit")  # Set the last edit of the project work.
        project.set_client(dictionary["client"])  # Sets the client from the dict as the client of the object.
        project.set_project_term_id(dictionary["project_term_id"])  # Sets the client from the dict as the client of the object.
        return project
