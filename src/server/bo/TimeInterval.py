import datetime
from server.bo import BusinessObject as bo


class TimeInterval(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        """Start der Zeiterfassung"""
        self.__start_event_id = None
        """Ende der Zeiterfassung"""
        self.__end_event_id = None
        """Zeitraum"""
        self.__time_period = None

    def get_start_event_id(self):
        """Auslesen vom Start der Zeiterfassung"""
        return self.__start_event_id

    def set_start_event_id(self, start_time):
        """Starten der Zeiterfassung"""
        self.__start_event_id = start_time

    def get_end_event_id(self):
        """Auslesen vom Ende der Zeiterfassung"""
        return self.__end_event_id

    def set_end_event_id(self, end_time):
        """Setzen des Endzeitpunktes"""
        self.__end_event_id = end_time

    def get_time_period(self):
        """Auslesen der Arbeitszeit"""
        return self.__time_period

    def set_time_period(self, time_period):
        """Setzen der Arbeitszeit"""
        self.__time_period = time_period

    def calculate_period(self, start_event, end_event_id):


        self.__time_period = self.__end_event_id - self.__start_event_id  # Muss noch getestet werden ob die berechnung mit dem Datum do funktioniert.

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self.__start_event_id,
                                                         self.__end_event_id, self.__time_period)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen zeitintervall()."""
        obj = TimeInterval()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_event_id(dictionary["start_time"])
        obj.set_end_event_id(dictionary["end_time"])
        obj.set_time_period(dictionary["time_period"])
        return obj
