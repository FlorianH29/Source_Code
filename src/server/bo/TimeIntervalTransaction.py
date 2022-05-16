from server.bo import Transaction as ta


class TimeIntervalTransaction(ta.Transaction):
    """Realisierung einer exemplarischen TimeIntervalTransaction-klasse.
    """
    def __init__(self):
        super().__init__()
        self.__affiliated_time_interval = None

    def set_affiliated_time_interval(self, time_interval):
        self.__affiliated_time_interval = time_interval

    def get_affiliated_time_interval(self):
        return self.__affiliated_time_interval

    def __str__(self):
        return "Transaction ({}, {}, {})".format(self.get_id(), self.get_last_edit(), self.__affiliated_time_interval)


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine TimeIntervalTransaction()."""
        obj = TimeIntervalTransaction()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_affiliated_time_interval(dictionary["affiliated_time_interval"])
        return obj

