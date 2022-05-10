from server.bo import BusinessObject as bo


class ProjectWork (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""    # The name of the project. (is str)
        self.__description = ""  # The description of the ProjectWork. (is str)
        self.__affiliated_activity = None  # The affiliated activity is an object of Activity.

    def set_name(self, name):
        self.__name = name

    def get_name(self):
        return self.__name

    def set_description(self, description):
        self.__description = description

    def get_description(self):
        return self.__description

    def set_affiliated_activity(self, affiliated_activity):
        self.affiliated_activity = affiliated_activity

    def get_affiliated_activity(self):
        return self.affiliated_activity

    def __str__(self):
        return "ProjectWork: \n  name: {}\n  client: {}\n  project_term: {}".format(self.get_name(), self.get_description(), self.get_affiliated_activity())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein ProjectWork()."""
        obj = ProjectWork()
        obj.set_id(dictionary["id"])  # Usually part of the business object.
        obj.set_name(dictionary["name"])  # Sets the name from the dict as the name of the object.
        obj.set_description(dictionary["description"])  # Sets the description from the dict as the description of the object.
        obj.set_affiliated_activity(dictionary["affiliated_activity"])  # Sets the affiliated_activity from the dict.
        return obj
