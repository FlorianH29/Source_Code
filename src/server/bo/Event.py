from server.bo import BusinessObject as bo
import datetime
from abc import ABC, abstractmethod


class Event(bo.BusinessObject, ABC):

    def __init__(self):
        super().__init__()
        self.__time_stamp = None  # Der Zeitpunkt des Eintretens des Ereignisses

    @abstractmethod
    def get_time_stamp(self):
        """Auslesen des Zeitpunktes."""
        pass

    @abstractmethod
    def set_time_stamp(self, value: datetime) -> datetime:
        """Setzen des Zeitpunktes. Typehint, datetime Objekt soll übergeben werden"""
        pass

