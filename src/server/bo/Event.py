from server.bo import BusinessObject as bo
import datetime


class Event(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._time_stamp = None  # Der Zeitpunkt des Eintretens des Ereignisses
        self._event_type = 0  # Typ des Ereignisses, entweder Start oder Ende eines Zeitintervalls

    def get_time_stamp(self):
        """Auslesen des Zeitpunktes."""
        return self._time_stamp

    def set_time_stamp(self, value: datetime) -> datetime:
        """Setzen des Zeitpunktes. Typehint, datetime Objekt soll übergeben werden"""
        self._time_stamp = value

    def get_event_type(self):
        """Auslesen des Zeitpunktes."""
        return self._event_type

    def set_event_type(self, value):
        self._event_type = value
        """Auslesen des Zeitpunktes."""

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Event: {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self.get_event_type(),
                                              self.get_time_stamp())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Event()."""
        obj = Event()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_event_type(dictionary["event_type"])
        obj.set_time_stamp(dictionary["time_stamp"])
        return obj
