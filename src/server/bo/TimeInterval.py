from server.bo import BusinessObject as bo
from abc import ABC


class TimeInterval(bo.BusinessObject, ABC):
    def __int__(self):
        super().__init__()
        """Start der Zeiterfassung"""
        self.__start_time = None
        """Ende der Zeiterfassung"""
        self.__end_time = None
        """Arbeitszeit"""
        self.__time_interval = None

    def get_start_time(self):
        """Auslesen vom start der Zeiterfassung"""
        return self.__start_time

    def set_start_time(self, start_time):
        """Starten der Zeiterfassung"""
        self.__start_time = start_time

    def get_end_time(self):
        """Auslesen vom ende der Zeiterfassung"""
        return self.__end_time

    def set_end_time(self, end_time):
        """Beenden der der Zeiterfassung"""
        self.__end_time = end_time

    def get_time_interval(self):
         """Auslesen vov der Arbeitszeit"""
         return self.__time_interval

    def set_time_interval(self, time_interval):
        """Beenden der Arbeitszeit"""
        self.__time_interval = time_interval

    def calculate_period(self):
        self.__time_interval = self.__end_time - self.__start_time # Muss noch getestet werden ob die berechnung mit dem Datum do funktioniert.

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}".format(self.get_id(),
                                                         self.get_last_edit(),
                                                         self.get_start_time(),
                                                         self.get_end_time(),
                                                         self.get_time_interval())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen zeitintervall()."""
        obj = TimeInterval()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_time(dictionary["start_time"])
        obj.set_end_time(dictionary["end_time"])
        obj.set_time_interval(dictionary["time_interval"])
        return obj
