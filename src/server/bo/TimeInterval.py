from server.bo import BusinessObject
from abc import ABC, abstractmethod


class TimeInterval(BusinessObject, ABC):
    def __int__(self):
        super().__init__()
        """Start der Zeiterfassung"""
        self.__start_event = None
        """Start der Zeiterfassung"""
        self.__end_event = None

    @abstractmethod
    def get_start_event(self):
        """Auslesen vom start des Zeitstempels"""
        return self.__start_event

    @abstractmethod
    def set_start_event(self, start_event):
        """Starten der Zeitmessung"""
        self.__start_event = start_event

    @abstractmethod
    def get_end_event(self):
        """Auslesen vom ende des Zeitstempels"""
        return self.__end_event

    @abstractmethod
    def set_end_event(self, end_event):
        """Beenden der Zeitmessung"""
        self.__end_event = end_event

    @abstractmethod
    def calculate_period(self):

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}".format(self.get_id(),
                                                         self.get_last_edit(),
                                                         self.get_start_event(),
                                                         self.get_end_event(),
                                                         self.get_time_interval())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen zeitintervall()."""
        obj = TimeInterval()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_event(dictionary["start_event"])
        obj.set_end_event(dictionary["end_event"])
        obj.set_time_interval(dictionary["time_interval"])
        return obj
