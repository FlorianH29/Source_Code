from server.bo import BusinessObject as bo

class Project (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""    # The name of the project.
        self.__client = ""  # The name of the client.
        self.poject_term: None  # The project term is an object of TimeInterval

    def set_name(self, name):
        self.__name = name

    def get_name(self):
        return self.__name

    def set_client(self, client):
        self.__client = client

    def get_client(self):
        return self.__client

    def set_project_term(self, project_term):
        self.project_term = project_term

    def get_project_term(self):
        return self.project_term

    def __str__(self):
        return "Project: \n name: {}\n client: {}\n project_term: {}".format(self.get_name(), self.get_client, self.get_project_term)