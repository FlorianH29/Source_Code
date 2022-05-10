from server.bo import BusinessObject as bo


class Project (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""    # The name of the project.
        self.__client = ""  # The name of the client.
        self.__project_term = None  # The project term is an object of TimeInterval

    def set_name(self, name):
        self.__name = name

    def get_name(self):
        return self.__name

    def set_client(self, client):
        self.__client = client

    def get_client(self):
        return self.__client

    def set_project_term(self, project_term):
        self.__project_term = project_term

    def get_project_term(self):
        return self.__project_term

    def set_last_edit(self, last_edit):
        self.__last_edit = last_edit

    def get_last_edit(self):
        return self.__last_edit

    def __str__(self):
        return "Project: \n  name: {}\n  client: {}\n  project_term: {}".format(self.get_name(), self.get_client(), self.get_project_term())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Project()."""
        obj = Project()
        obj.set_id(dictionary["id"])  # Usually part of the business object.
        obj.set_name(dictionary["name"])  # Sets the name from the dict as the name of the object.
        obj.set_client(dictionary["client"])  # Sets the client from the dict as the client of the object.
        obj.set_project_term(dictionary["project_term"])  # Sets the client from the dict as the client of the object.
        return obj
