from server.bo import BusinessObject as bo
import datetime


class Event (bo.BusinessObject):

    """ Realisierung einer examplarischen Ereignis Klasse.

    Jedes Ereignis verfügt über einen Zeitpunkt, an dem es eingetreten ist und einen Namen.
    """

    def __init__(self):
        super().__init__()
        self.__name = ""  # Der Name des Ereignisses
        self.__time_stamp = datetime.datetime.now()  # Der Zeitpunkt des Eintretens des Ereignisses

    def get_name(self):
        """Auslesen des Namens."""
        return self.__name

    def get_time_stamp(self):
        """Auslesen des Zeitpunktes."""
        return self.__time_stamp

    def set_name(self, value):
        """Setzen des Namens."""
        self.__name = value

    def set_time_stamp(self, value: datetime) -> datetime:  # typehint, datetime Objekt soll übergeben werden
        """Setzen des Zeitpunktes."""
        self.__time_stamp = value

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Event: {}, {}, {}".format(self.get_id(), self.__name, self.__time_stamp)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        obj = Event()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_name(dictionary["name"])
        obj.set_time_stamp(dictionary["time_stamp"])

        return obj
