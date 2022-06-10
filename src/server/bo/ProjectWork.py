from server.bo import TimeInterval as ti


class ProjectWork (ti.TimeInterval):

    def __init__(self):
        super().__init__()
        self._project_work_name = ""    # The name of the project. (is str)
        self._description = ""  # The description of the ProjectWork. (is str)
        self._affiliated_activity = None

    def set_project_work_name(self, project_work_name):
        self._project_work_name = project_work_name

    def get_project_work_name(self):
        return self._project_work_name

    def set_description(self, description):
        self._description = description

    def get_description(self):
        return self._description

    def set_affiliated_activity(self, affiliated_activity):
        self._affiliated_activity = affiliated_activity

    def get_affiliated_activity(self):
        return self._affiliated_activity

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
        projectwork.set_id(dictionary["id"])  # Eigentlicher Teil von business object.
        projectwork.set_last_edit("last_edit")  # Setzten des last_edit von projectwork
        projectwork.set_project_work_name(dictionary["project_work_name"])  # Setzt Namen aus dict() für ProjectWork
        projectwork.set_description(dictionary["description"])  # Setzt description aus dict() für ProjectWork
        projectwork.set_start_event(dictionary["start_event"])  # Setzt start_time aus dict() für ProjectWork
        projectwork.set_end_event(dictionary["end_event"])  # Setzt end_time aus dict() für ProjectWork
        projectwork.set_time_period(dictionary["time_period"])  # Setzt time_periode aus dict() für ProjectWork
        projectwork.set_affiliated_activity(dictionary["affiliated_activity"])  # Setzt affiliated_activity aus dict() für ProjectWork
        return projectwork
