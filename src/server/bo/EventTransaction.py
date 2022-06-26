from server.bo import Transaction as TA


class EventTransaction (TA.Transaction):
    """Realisierung einer exemplarischen EventTransaction-klasse.
    """
    def __init__(self):
        super().__init__()
        self._event = None  # Event Id von zugehörigem Event-Objekt
        self._arrive = None  # Arrive Id von zugehörigem Arrive-Objekt
        self._departure = None  # Departure Id von zugehörigem Departure-Objekt

    def get_event(self):
        return self._event

    def set_event(self, event_id):
        self._event = event_id

    def get_arrive(self):
        return self._arrive

    def set_arrive(self, arrive_id):
        self._arrive = arrive_id

    def get_departure(self):
        return self._departure

    def set_departure(self, departure_id):
        self._departure = departure_id

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