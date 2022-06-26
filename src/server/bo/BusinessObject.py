import datetime
from abc import ABC


class BusinessObject(ABC):
    """Gemeinsame Basisklasse aller in diesem Projekt für die Umsetzung des Fachkonzepts relevanten Klassen.

    Zentrales Merkmal ist, dass jedes BusinessObject eine Nummer besitzt, die man in
    einer relationalen Datenbank auch als Primärschlüssel bezeichnen würde.
    """

    def __init__(self):
        self._id = 0  # Die eindeutige Identifikationsnummer einer Instanz dieser Klasse.
        self._last_edit = None  # Datum der letzten Änderung
        self._deleted = 0  # Wert, der besagt ob das BO gelöscht wurde

    def set_last_edit(self, value: datetime):
        """Hier sollte ein Value vom Typ Datetime übergeben werden, genauer datetime.datetime.now()"""
        self._last_edit = value

    def get_last_edit(self):
        """Auslesen des letzten Bearbeitungszeitpunkts"""
        return self._last_edit

    def get_id(self):
        """Auslesen der ID."""
        return self._id

    def set_id(self, value):
        """Setzen der ID."""
        self._id = value

    def get_deleted(self):
        """Auslesen des gelöscht Werts."""
        return self._deleted

    def set_deleted(self, value):
        """Setzen gelöscht Werts."""
        self._deleted = value
