from server.bo import BusinessObject as bo


class ProjectWork (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__project_work_name = ""    # The name of the project. (is str)
        self.__description = ""  # The description of the ProjectWork. (is str)
        self.__affiliated_activity = None

    def set_project_work_name(self, project_work_name):
        self.__project_work_name = project_work_name

    def get_project_work_name(self):
        return self.__project_work_name

    def set_description(self, description):
        self.__description = description

    def get_description(self):
        return self.__description

    def set_affiliated_activity(self, affiliated_activity):
        self.__affiliated_activity = affiliated_activity

    def get_affiliated_activity(self):
        return self.__affiliated_activity

    def __str__(self):
        """Ausgabe von: id, last_edit, project_work_name, description"""
        return "ProjectWork:  project_id: {}  last_edit: {}  project_work_name: {}  " \
               "description: {} affiliated_activity: {}".format(self.get_id(), self.get_last_edit(),
                                                                self.get_project_work_name(), self.get_description(),
                                                                self.get_affiliated_activity())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein ProjectWork()."""
        projectwork = ProjectWork()
        projectwork.set_id(dictionary["id"])  # Usually part of the business object.
        projectwork.set_last_edit("last_edit")  # Set the last edit of the project work.
        projectwork.set_project_work_name(dictionary["project_work_name"])  # Sets the project_work_name from the dict as the name of the object.
        projectwork.set_description(dictionary["description"])  # Sets the description from the dict as the description of the object.
        projectwork.set_affiliated_activity(dictionary["affiliated_activity"])
        return projectwork
