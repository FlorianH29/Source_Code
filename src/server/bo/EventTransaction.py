from server.bo import Transaction as TA


class EventTransaction (TA.Transaction):
    """Realisierung einer exemplarischen EventTransaction-klasse.
    """
    def __init__(self):
        super().__init__()
        self._event = None
        self._arrive = None
        self._departure = None

    def get_event(self):
        return self._event

    def set_event(self, event):
        self._event = event

    def set_arrive(self, arrive):
        self._arrive = arrive

    def get_arrive(self):
        return self._arrive

    def set_departure(self, departure):
        self._departure = departure

    def get_departure(self):
        return self._departure

    def __str__(self):
        return "Transaction ({}, {}, {}, {}, {})" \
            .format(self.get_id(), self.get_last_edit(), self._event, self._arrive, self._departure)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine EventTransaction()."""
        obj = EventTransaction()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_event(dictionary["event"])
        obj.set_event(dictionary["arrive"])
        obj.set_event(dictionary["departure"])
        return obj