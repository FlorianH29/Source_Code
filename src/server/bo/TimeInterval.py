import datetime
from server.bo import BusinessObject as bo


class TimeInterval(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        """Start der Zeiterfassung"""
        self.__start_event = None
        """Ende der Zeiterfassung"""
        self.__end_event = None
        """Zeitraum"""
        self.__time_period = None

    def get_start_event(self):
        """Auslesen vom Start der Zeiterfassung"""
        return self.__start_event

    def set_start_event(self, start_time):
        """Starten der Zeiterfassung"""
        self.__start_event = start_time

    def get_end_event(self):
        """Auslesen vom Ende der Zeiterfassung"""
        return self.__end_event

    def set_end_event(self, end_time):
        """Setzen des Endzeitpunktes"""
        self.__end_event = end_time

    def get_time_period(self):
        """Auslesen der Arbeitszeit"""
        return self.__time_period

    def set_time_period(self, time_period):
        """Setzen der Arbeitszeit"""
        self.__time_period = time_period

    def calculate_period(self, start_event, end_event):
        self.__time_period = end_event.get_time_stamp() - start_event.get_time_stamp()
        return self.__time_period

        #self.__time_period = self.__end_event - self.__start_event  # Muss noch getestet werden ob die berechnung mit dem Datum do funktioniert.

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self.__start_event,
                                                         self.__end_event, self.__time_period)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen zeitintervall()."""
        obj = TimeInterval()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_event(dictionary["start_time"])
        obj.set_end_event(dictionary["end_time"])
        obj.set_time_period(dictionary["time_period"])
        return obj
