from server.bo.Person import Person
from server.bo.Project import Project
from server.db.Mapper import Mapper


class ProjectMemberMapper (Mapper):
    """Mapper-Klasse, die ProjectMember-Objekte auf eine relationale Datenbank abbildet.
    Dazu mehrere Methoden, mit deren Hilfe Objekte gesucht, erzeugt, modifiziert und gelöscht werden können.
    Ist bidirektional, Objekte können in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen eines Departure-Ereignisses mit vorgegebener Ereignis ID. Rückgabe von genau einem Objekt.

        :param key Primärschlüsselattribut (->DB)
        :return Projekt-Member-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT departure_id, last_edit, time_stamp FROM departure WHERE departure_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (departure_id, last_edit, time_stamp) = tuples[0]
            departure = Departure()
            departure.set_id(departure_id)
            departure.set_last_edit(last_edit)
            departure.set_time_stamp(time_stamp)

            result = departure
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller End-Ereignisse.

        :return  Sammlung mit End-Ereignis-Objekten, die sämtliche End-Ereignisse repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()