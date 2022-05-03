from server.bo import BusinessObject

class TimeInterval(BusinessObject):

    def __int__(self):
        super().__init__()
        self.__start_event = ""         """ Start der Zeiterfassung"""
        self.__end_event = ""           """ Ende der Zeiterfassung"""

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

