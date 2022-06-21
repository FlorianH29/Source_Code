from server.bo import Transaction as ta


class TimeIntervalTransaction(ta.Transaction):
    """Realisierung einer exemplarischen TimeIntervalTransaction-klasse.
    """
    def __init__(self):
        super().__init__()
        self._affiliated_time_interval = None
        self._affiliated_break = None
        self._affiliated_projectwork = None

    def set_affiliated_time_interval(self, time_interval):
        self._affiliated_time_interval = time_interval

    def get_affiliated_time_interval(self):
        return self._affiliated_time_interval

    def get_affiliated_break(self):
        return self._affiliated_break

    def set_affiliated_break(self, affiliated_break):
        self._affiliated_break = affiliated_break

    def set_affiliated_projectwork(self, project_work):
        self._affiliated_projectwork = project_work

    def get_affiliated_projectwork(self):
        return self._affiliated_projectwork

    def __str__(self):
        return "Transaction ({}, {}, {}, {}, {})".format(self.get_id(), self.get_last_edit(),
                                                         self._affiliated_time_interval, self._affiliated_break,
                                                         self._affiliated_projectwork)


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine TimeIntervalTransaction()."""
        obj = TimeIntervalTransaction()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_affiliated_time_interval(dictionary["affiliated_time_interval"])
        obj.set_affiliated_break(dictionary["affiliated_break"])
        obj.set_affiliated_projectwork(dictionary["affiliated_projectwork"])

        return obj

