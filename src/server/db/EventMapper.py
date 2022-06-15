from server.bo.Event import Event
from server.db.Mapper import Mapper


class EventMapper(Mapper):
    """Mapper-Klasse, die Event-Objekte auf eine relationale Datenbank abbildet.
    Dazu mehrere Methoden, mit deren Hilfe Objekte gesucht, erzeugt, modifiziert und gelöscht werden können.
    Ist bidirektional, Objekte können in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen eines Events mit vorgegebener ID. Rückgabe von genau einem Objekt.

        :param key: Primärschlüsselattribut (->DB)
        :return Event-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM event WHERE event_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)

            result = event
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_by_affiliated_person_id(self, key):
        """Suchen des letzten Events mit vorgegebener zugheöriger Personen ID. Rückgabe von genau einem Objekt.

        :param key: Fremdschlüsselattribut (->DB)
        :return Event-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM SoPraTestDB.event " \
                  "WHERE time_stamp = " \
                  "(SELECT MAX(time_stamp) FROM Sopratestdb.event WHERE affiliated_person_id = {})".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)

            result = event
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_start_event_project_work(self, key):
        """Suchen des letzten Startevents einer Projektarbeit mit vorgegebener Personen ID.
        Rückgabe von genau einem Objekt.

        :param key: Fremdschlüsselattribut (->DB)
        :return Event-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM event WHERE event_id = (SELECT MAX(event_id) FROM event " \
                  "WHERE affiliated_person_id={} AND event_type=1)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)

            result = event
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_end_event_project_work(self, key):
        """Suchen des letzten Endevents einer Projektarbeit mit vorgegebener Personen ID.
        Rückgabe von genau einem Objekt.

        :param key: Primärschlüsselattribut (->DB)
        :return Event-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM event WHERE event_id = (SELECT MAX(event_id) FROM event " \
                  "WHERE affiliated_person_id={} AND event_type=2)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)

            result = event
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_start_event_break(self, key):
        """Suchen des letzten Startevents einer Pause mit vorgegebener Personen ID.
         Rückgabe von genau einem Objekt.

        :param key: Primärschlüsselattribut (->DB)
        :return Event-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM event WHERE event_id = (SELECT MAX(event_id) FROM event " \
                  "WHERE affiliated_person_id={} AND event_type=3)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)

            result = event
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_end_event_break(self, key):
        """Suchen des letzten Startevents einer Pause mit vorgegebener Personen ID.
         Rückgabe von genau einem Objekt.

        :param key: Primärschlüsselattribut (->DB)
        :return Event-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM event WHERE event_id = (SELECT MAX(event_id) FROM event " \
                  "WHERE affiliated_person_id={} AND event_type=4)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)

            result = event
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Events.

        :return Sammlung mit Event-Objekten, die sämtliche Arrive-Ereignisse repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from event")
        tuples = cursor.fetchall()

        for (event_id, last_edit, event_type, time_stamp, affiliated_person_id) in tuples:
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            result.append(event)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, event):
        """Einfügen eines Event-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param event: das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(event_id) AS maxid FROM event")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Event-Objekt zu."""
                event.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                event.set_id(1)

        command = "INSERT INTO event (event_id, last_edit, event_type, time_stamp, affiliated_person_id) " \
                  "VALUES (%s,%s,%s,%s,%s)"
        data = (event.get_id(), event.get_last_edit(), event.get_event_type(), event.get_time_stamp(),
                event.get_affiliated_person())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return event

    def update(self, event):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param event das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE event SET last_edit=%s, event_type=%s, time_stamp=%s, affiliated_person_id=%s " \
                  "WHERE event_id=%s"
        data = (event.get_last_edit(), event.get_event_type(), event.get_time_stamp(), event.get_id(),
                event.get_affiliated_person())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, event):
        """Löschen der Daten eines Event-Objekts aus der Datenbank.

        :param event: das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM event WHERE event_id={}".format(event.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
