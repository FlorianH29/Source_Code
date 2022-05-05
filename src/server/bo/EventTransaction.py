from server.bo import Transaction as TA


class EventTransaction (TA.Transaction):

    def __init__(self):
        super().__init__()
        self.__event = None

    def get_event(self):
        return self.__event

    def set_event(self, event):
        self.__event = event

    def __str__(self):
        return "Transaction ({}, {}, {})" \
            .format(self.get_id(), self.get_last_edit(), self.__event)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine Transaction()."""
        obj = EventTransaction()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_event(dictionary["event"])
        return obj