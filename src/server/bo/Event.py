from server.bo import BusinessObject as bo
import datetime


class Event(bo.BusinessObject):
    """ Realisierung einer examplarischen Ereignis Klasse.

    Jedes Ereignis verfügt über einen Zeitpunkt, an dem es eingetreten ist und einen Namen.
    """

    def __init__(self):
        super().__init__()
        self.__name = ""  # Der Name des Ereignisses
        self.__time_stamp = datetime.datetime.now()  # Der Zeitpunkt des Eintretens des Ereignisses
        self.__last_edit = None  # Datum der letzten Änderung
        self.__buchungsid = 0  # ID der dem Ereignis zugeordneten Buchung

    def get_name(self):
        """Auslesen des Namens."""
        return self.__name

    def get_time_stamp(self):
        """Auslesen des Zeitpunktes."""
        return self.__time_stamp

    def get_last_edit(self):
        """Auslesen der letzten Änderung"""
        return self.__last_edit

    def get_buchungsid(self):
        """Auslesen der ID der Buchung"""
        return self.__buchungsid

    def set_name(self, value):
        """Setzen des Namens."""
        self.__name = value

    def set_time_stamp(self, value: datetime) -> datetime:  # typehint, datetime Objekt soll übergeben werden
        """Setzen des Zeitpunktes."""
        self.__time_stamp = value

    def set_last_edit(self, value: datetime) -> datetime:
        """Setzen der letzten Änderung."""
        self.__last_edit = value

    def set_buchugnsid(self, value):
        """Setzen der ID der Buchung"""
        self.__buchungsid = value

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Event: {}, {}, {}, {}, {}".format(self.get_id(), self.__last_edit, self.__time_stamp,
                                                  self.__buchungsid, self.__name, )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Event()."""
        obj = Event()
        obj.set_id(dictionary["id"])
        obj.set_name(dictionary["name"])
        obj.set_time_stamp(dictionary["time_stamp"])

        return obj
