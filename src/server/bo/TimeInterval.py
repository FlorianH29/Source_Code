from server.bo import BusinessObject as bo
import datetime


class TimeInterval(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        """Start der Zeiterfassung"""
        self.__start_time = None
        """Ende der Zeiterfassung"""
        self.__end_time = None
        """Arbeitszeit"""
        self.__time_period = None
        """Last edit wird auf den akutellen Zeitstempel gestellt"""
        self.__last_edit = datetime.datetime.now()

    def get_start_time(self):
        """Auslesen vom Start der Zeiterfassung"""
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

    def get_time_period(self):
        """Auslesen vov der Arbeitszeit"""
        return self.__time_period

    def set_time_period(self, time_period):
        """Beenden der Arbeitszeit"""
        self.__time_period = time_period

    def calculate_period(self):
        self.__time_period = self.__end_time - self.__start_time  # Muss noch getestet werden ob die berechnung mit dem Datum do funktioniert.

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self.__start_time,
                                                         self.__end_time, self.__time_period)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen zeitintervall()."""
        obj = TimeInterval()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_time(dictionary["start_time"])
        obj.set_end_time(dictionary["end_time"])
        obj.set_time_period(dictionary["time_period"])
        return obj
