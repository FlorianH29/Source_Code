from server.bo import TimeInterval as ti


class ProjectWork (ti.TimeInterval):

    def __init__(self):
        super().__init__()
        self._project_work_name = ""    # Der Name die ProjectWork. (init als leerer str)
        self._description = ""  # Die Beschreibung für die ProjectWork. (init als leerer str)
        self._affiliated_activity_id = None  # Die zugehörige Activity (init als None)

    def set_project_work_name(self, project_work_name):
        self._project_work_name = project_work_name

    def get_project_work_name(self):
        return self._project_work_name

    def set_description(self, description):
        self._description = description

    def get_description(self):
        return self._description

    def set_affiliated_activity(self, affiliated_activity):
        self._affiliated_activity_id = affiliated_activity

    def get_affiliated_activity(self):
        return self._affiliated_activity_id

    def __str__(self):
        """Ausgabe von: id, last_edit, project_work_name, description, affiliated_activity, end_event_id,
        start_event_id"""
        return "ProjectWork:  project_id: {}  last_edit: {}  project_work_name: {}  " \
               "description: {} affiliated_activity: {} end_event: {}  start_event: {}  " \
               "time_period: {}".format(self.get_id(), self.get_last_edit(),
                                        self.get_project_work_name(), self.get_description(),
                                        self._affiliated_activity_id(), self._time_period,
                                        self.get_start_event(), self.get_end_event())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein ProjectWork()."""
        projectwork = ProjectWork()
        projectwork.set_id(dictionary["id"])  # Eigentlicher Teil von business object.
        projectwork.set_last_edit("last_edit")  # Setzten des last_edit von projectwork
        projectwork.set_project_work_name(dictionary["project_work_name"])  # Setzt Namen aus dict() für ProjectWork
        projectwork.set_description(dictionary["description"])  # Setzt description aus dict() für ProjectWork
        projectwork.set_affiliated_activity(dictionary["affiliated_activity_id"])  # Setzt affiliated_activity aus
        # dict() für ProjectWork
        projectwork.set_start_event(dictionary["start_event_id"])  # Setzt start_time aus dict() für ProjectWork
        projectwork.set_end_event(dictionary["end_event_id"])  # Setzt end_time aus dict() für ProjectWork
        projectwork.set_time_period(dictionary["time_period"])  # Setzt time_periode aus dict() für ProjectWork
        return projectwork
