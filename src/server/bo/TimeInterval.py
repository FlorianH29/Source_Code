import datetime
from server.bo import BusinessObject

class TimeInterval(BusinessObject):
    def __int__(self):
        super().__init__()
        """Start der Zeiterfassung"""
        self.__start_event = None
        """Start der Zeiterfassung"""
        self.__end_event = None
        """Zeitstempel"""
        self.__time_stamp = datetime.datetime.now()

    def get_start_event(self):
        """Auslesen vom start des Zeitstempels"""
        return self.__start_event

    def set_start_event(self, start_event):
        """Starten der Zeitmessung"""
        self.__start_event = start_event

    def get_end_event(self):
        """Auslesen vom ende des Zeitstempels"""
        return self.__end_event

    def set_end_event(self, end_event):
        """Beenden der Zeitmessung"""
        self.__end_event = end_event

    def calculate_period(self):
        print(end_event - start_event)

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}".format(self.get_id(),
                                                     self.__last_edit,
                                                     self.__start_event,
                                                     self.__end_event,
                                                     self.__time_stamp)

   @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine zeitintervall()."""
        obj = TimeInterval()
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_event(dictionary["start_event"])
        obj.set_end_event(dictionary["end_event"])
        obj.set_time_stamp(dictionary["time_stamp"])
        return obj