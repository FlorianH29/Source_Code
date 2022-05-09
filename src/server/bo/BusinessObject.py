from abc import ABC, abstractmethod


class BusinessObject(ABC):
    """Gemeinsame Basisklasse aller in diesem Projekt für die Umsetzung des Fachkonzepts relevanten Klassen.

    Zentrales Merkmal ist, dass jedes BusinessObject eine Nummer besitzt, die man in
    einer relationalen Datenbank auch als Primärschlüssel bezeichnen würde.
    """
    def __init__(self):
        self._id = 0   # Die eindeutige Identifikationsnummer einer Instanz dieser Klasse.
        self._last_edit = None  # Beinhaltet den letzten bearbeitungszeitpunkt

    def get_id(self):
        """Auslesen der ID."""
        return self._id

    def set_id(self,value):
        """Setzen der ID."""
        self._id = value

    def set_last_edit(self, last_edit):
        """Setzten des letzten Bearbeitungszeitpunkts"""
        self.__last_edit = last_edit

    def get_last_edit(self):
        """Auslesen des letzten Bearbeitungszeitpunkts"""
        return self.__last_edit