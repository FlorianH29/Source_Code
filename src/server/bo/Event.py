from server.bo import BusinessObject as bo
import datetime
from abc import ABC, abstractmethod


class Event(bo.BusinessObject, ABC):

    def __init__(self):
        super().__init__()
        self.__time_stamp = None  # Der Zeitpunkt des Eintretens des Ereignisses
        self.__type = ""  # Typ des Ereignisses, entweder Start oder Ende eines Zeitintervalls


    def get_time_stamp(self):
        """Auslesen des Zeitpunktes."""
        return self.__time_stamp


    def set_time_stamp(self, value: datetime) -> datetime:
        """Setzen des Zeitpunktes. Typehint, datetime Objekt soll übergeben werden"""
        self.__time_stamp = value


    def get_type(self):
        """Auslesen des Zeitpunktes."""
        return self.__type


    def set_type(self, value):
        self.__type = value
        """Auslesen des Zeitpunktes."""


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen Event()."""
        obj = Event()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_type(dictionary["event_type"])
        return obj
