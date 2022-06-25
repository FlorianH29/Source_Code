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
        command = "SELECT * FROM event WHERE event_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)

            result = event
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all_by_person_id(self, person_id):
        """Auslesen aller Events einer Person.

        :return Sammlung aller Event-Objekte einer Person.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM event WHERE affiliated_person_id ={} AND deleted=0".format(person_id))
        tuples = cursor.fetchall()

        for (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) in tuples:
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)
            result.append(event)

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_by_affiliated_person_id(self, person_id):
        """Suchen des letzten Events mit vorgegebener zugheöriger Personen ID. Rückgabe von genau einem Objekt.

        :param person_id: Fremdschlüsselattribut (->DB)
        :return Event-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM event WHERE time_stamp = (SELECT MAX(time_stamp) FROM event " \
                  "WHERE affiliated_person_id = {} AND deleted=0)".format(person_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)

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
                  "WHERE affiliated_person_id={} AND event_type=1 AND deleted=0)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)

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
                  "WHERE affiliated_person_id={} AND event_type=2 AND deleted=0)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)

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
                  "WHERE affiliated_person_id={} AND event_type=3 AND deleted=0)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)

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
                  "WHERE affiliated_person_id={} AND event_type=4 AND deleted=0)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)

            result = event
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_project_duration_event(self, key):
        """Suchen des letzten Events mit vorgegebener zugheöriger Personen ID. Rückgabe von genau einem Objekt.

        :param key: Fremdschlüsselattribut (->DB)
        :return Event-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM event WHERE event_id = (SELECT MAX(event_id) FROM event " \
                  "WHERE event_type = {} AND deleted=0)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) = tuples[0]
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)

            result = event
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_event_type(self):
        """Suchen des letzten Events und Rückgabe seines Event-Typs in einem Tupel.

        :return ein Tupel mit einem Event-Typ.
        """
        result = ""
        cursor = self._cnx.cursor()
        cursor.execute("SELECT event_type FROM event WHERE deleted=0 AND event_id = (SELECT MAX(event_id) FROM event)")
        tuples = cursor.fetchall()

        for (event_type) in tuples:
            event = Event()
            event.set_event_type(event_type)
            result = event.get_event_type()

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Events.

        :return Sammlung mit Event-Objekten, die sämtliche nicht gelöschte Arrive-Ereignisse repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM event WHERE deleted=0")
        tuples = cursor.fetchall()

        for (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) in tuples:
            event = Event()
            event.set_id(event_id)
            event.set_last_edit(last_edit)
            event.set_event_type(event_type)
            event.set_time_stamp(time_stamp)
            event.set_affiliated_person(affiliated_person_id)
            event.set_deleted(deleted)
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

        command = "INSERT INTO event (event_id, last_edit, event_type, time_stamp, affiliated_person_id, deleted) " \
                  "VALUES (%s,%s,%s,%s,%s,%s)"
        data = (event.get_id(), event.get_last_edit(), event.get_event_type(), event.get_time_stamp(),
                event.get_affiliated_person(), event.get_deleted())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return event

    def update(self, event):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param event das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE event SET last_edit=%s, event_type=%s, time_stamp=%s, affiliated_person_id=%s, deleted=%s " \
                  "WHERE event_id=%s"
        data = (event.get_last_edit(), event.get_event_type(), event.get_time_stamp(),event.get_affiliated_person(),
                event.get_deleted(), event.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def behelfsupdate(self, event):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param event das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE event SET last_edit=%s, deleted=%s,  time_stamp=%s, event_type=%s, affiliated_person_id=%s " \
                  "WHERE event_id=%s"
        data = (event.get_last_edit(), event.get_deleted(),  event.get_time_stamp(), event.get_event_type(),
                event.get_affiliated_person(), event.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, event):
        """Setzen der deleted flag auf 1, sodass der Event Eintrag nicht mehr ausgegeben wird.

        :param event: das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "UPDATE event SET deleted=1 WHERE event_id={}".format(event.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
