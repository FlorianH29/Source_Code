from server.bo import Event as ev
import datetime


class Departure (ev.Event):

    def __init__(self):
        super().__init__()
        self._time_stamp = 0  # Der Zeitpunkt, an dem der Mitarbeiter geht

    def get_time_stamp(self):
        """Auslesen des Zeitpunktes."""
        return self._time_stamp

    def set_time_stamp(self, value: datetime) -> datetime:
        """Setzen des Zeitpunktes. Typehint, datetime Objekt soll übergeben werden"""
        self._time_stamp = value

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Event: {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self._time_stamp,
                                              self.get_affiliated_person())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Departure-Event()."""
        obj = Departure()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_time_stamp(dictionary["time_stamp"])
        obj.set_affiliated_person(dictionary["affiliated_person"])

        return obj
