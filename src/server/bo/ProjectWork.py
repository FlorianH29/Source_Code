from server.bo import BusinessObject as bo


class ProjectWork (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""    # The name of the project. (is str)
        self.__description = ""  # The description of the ProjectWork. (is str)

    def set_name(self, name):
        self.__name = name

    def get_name(self):
        return self.__name

    def set_description(self, description):
        self.__description = description

    def get_description(self):
        return self.__description

    def __str__(self):
        """Ausgabe von: id, last_edit, name, description"""
        return "ProjectWork: \n  project_id: {}\n  last_edit: {} \n  name: {}\n  description: {}".format(self.get_id(), self.get_last_edit(), self.get_name(), self.get_description())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein ProjectWork()."""
        projectwork = ProjectWork()
        projectwork.set_id(dictionary["id"])  # Usually part of the business object.
        projectwork.set_last_edit("last_edit")  # Set the last edit of the project work.
        projectwork.set_name(dictionary["name"])  # Sets the name from the dict as the name of the object.
        projectwork.set_description(dictionary["description"])  # Sets the description from the dict as the description of the object.
        return projectwork
