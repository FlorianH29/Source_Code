from server.bo import Event as ev
import datetime


class Departure (ev.Event):

    def __init__(self):
        super().__init__()
        self.__time_stamp = datetime.datetime.now()  # Der Zeitpunkt, an dem der Mitarbeiter geht

    def get_time_stamp(self):
        """Auslesen des Zeitpunktes."""
        return self.__time_stamp

    def set_time_stamp(self, value: datetime) -> datetime:
        """Setzen des Zeitpunktes. Typehint, datetime Objekt soll übergeben werden"""
        self.__time_stamp = value

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Event: {}, {}, {}".format(self.get_id(), self.get_last_edit(), self.__time_stamp)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein End-Event()."""
        obj = Departure()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_time_stamp(dictionary["time_stamp"])

        return obj
