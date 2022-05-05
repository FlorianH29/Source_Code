from server.bo import Transaction as TA


class TimeIntervalTransaction(TA.Transaction):

    def __init__(self):
        super().__init__()
        self.__time_interval = None

    def set_time_interval(self, time_interval):
        self.__time_interval = time_interval

    def get_time_interval(self):
        return self.__time_interval

    def __str__(self):
        return "Transaction ({}, {}, {})" \
            .format(self.get_id(), self.get_last_edit(), self.__time_interval)


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine Transaction()."""
        obj = TimeIntervalTransaction()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_time_interval(dictionary["time_interval"])
        return obj

