import datetime
from server.bo import BusinessObject as bo


class TimeInterval(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        """ID eines Events, Start der Zeiterfassung, für alle Zeitintervalle die nicht Kommen und Gehen behandeln"""
        self._start_event_id = None
        """ID eines Events, Ende der Zeiterfassung, für alle Zeitintervalle die nicht Kommen und Gehen behandeln"""
        self._end_event_id = None
        """Zeitraum"""
        self._time_period = None
        """ID des Kommen Events"""
        self._arrive_id = None
        """ID des Gehen Events"""
        self._departure_id = None

    def get_start_event(self):
        """Auslesen vom Start der Zeiterfassung"""
        return self._start_event_id

    def set_start_event(self, start_event_id):
        """Starten der Zeiterfassung"""
        self._start_event_id = start_event_id

    def get_end_event(self):
        """Auslesen vom Ende der Zeiterfassung"""
        return self._end_event_id

    def set_end_event(self, end_event_id):
        """Setzen des Endzeitpunktes"""
        self._end_event_id = end_event_id

    def get_arrive(self):
        """Auslesen der ID des zugehörigen Kommenevents"""
        return self._arrive_id

    def set_arrive(self, arrive_id):
        """Kommen ID setzen"""
        self._arrive_id = arrive_id

    def get_departure(self):
        """Auslesen der ID des zugehörigen Gehenevents"""
        return self._departure_id

    def set_departure(self, departure_id):
        """Gehen ID setzen"""
        self._departure_id = departure_id

    def get_time_period(self):
        """Auslesen des Zeitraumes"""
        return self._time_period

    def set_time_period(self, time_period):
        """Setzen des Zeitraumes"""
        self._time_period = time_period

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "TimeInterval: {}, {}, {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self._start_event_id,
                                                                 self._end_event_id, self._time_period, self._arrive_id,
                                                                 self._departure_id)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen zeitintervall()."""
        obj = TimeInterval()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_start_event(dictionary["start_event_id"])
        obj.set_end_event(dictionary["end_event_id"])
        obj.set_time_period(dictionary["time_period"])
        obj.set_arrive(dictionary["arrive_id"])
        obj.set_departure(dictionary["departure_id"])
        return obj
