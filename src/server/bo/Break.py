from server.bo import TimeInterval as ti


class Break(ti.TimeInterval):
    def __int__(self):
        super().__init__()

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self._start_event_id,
                                                         self._end_event_id, self._time_period)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen zeitintervall()."""
        obj = Break()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_event(dictionary["start_event_id"])
        obj.set_end_event(dictionary["end_event_id"])
        obj.set_time_period(dictionary["time_period"])
        return obj
