from abc import ABC, abstractmethod
import datetime


class BusinessObject(ABC):
    """Gemeinsame Basisklasse aller in diesem Projekt für die Umsetzung des Fachkonzepts relevanten Klassen.

    Zentrales Merkmal ist, dass jedes BusinessObject eine Nummer besitzt, die man in
    einer relationalen Datenbank auch als Primärschlüssel bezeichnen würde.
    """

    def __init__(self):
        self._id = 0  # Die eindeutige Identifikationsnummer einer Instanz dieser Klasse.
        self._last_edit = None  # Datum der letzten Änderung

    def set_last_edit(self, value: datetime):
        """Hier sollte ein Value vom Typ Datetime übergeben werden, genauer datetime.datetime.now()"""
        self._last_edit = value

    def get_last_edit(self):
        return self._last_edit

    def get_id(self):
        """Auslesen der ID."""
        return self._id

    def set_id(self, value):
        """Setzen der ID."""
        self._id = value
