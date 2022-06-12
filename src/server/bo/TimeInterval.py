import datetime
from server.bo import BusinessObject as bo


class TimeInterval(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        """Start der Zeiterfassung"""
        self._start_event = None
        """Ende der Zeiterfassung"""
        self._end_event = None
        """Zeitraum"""
        self._time_period = None

    def get_start_event(self):
        """Auslesen vom Start der Zeiterfassung"""
        return self._start_event

    def set_start_event(self, start_time):
        """Starten der Zeiterfassung"""
        self._start_event = start_time

    def get_end_event(self):
        """Auslesen vom Ende der Zeiterfassung"""
        return self._end_event

    def set_end_event(self, end_time):
        """Setzen des Endzeitpunktes"""
        self._end_event = end_time

    def get_time_period(self):
        """Auslesen des Zeitraumes"""
        return self._time_period

    def set_time_period(self, time_period):
        """Setzen des Zitraumes"""
        self._time_period = time_period

    def get_interval_start(self):
        if self._start_event is not None:
            return self._end_event.get_time_stamp()
        else:
            return None

    def get_interval_end(self):
        if self._end_event is not None:
            return self._end_event.get_time_stamp()
        else:
            return None

    def calculate_period(self):
        """Berechnen des Zeitraumes"""
        self._time_period = self.get_interval_end() - self.get_interval_start()
        return self._time_period

    def set_interval_by_id(self, id):
        pass

    def set_start_event_by_id(self, id):
        self.get_start_event()

    def set_end_event_by_id(self, id):
        pass

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self._start_event,
                                                         self._end_event, self._time_period)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen zeitintervall()."""
        obj = TimeInterval()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_event(dictionary["start_event"])
        obj.set_end_event(dictionary["end_event"])
        obj.set_time_period(dictionary["time_period"])
        return obj
