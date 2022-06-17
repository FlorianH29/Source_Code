from server.bo.Arrive import Arrive
from server.db.Mapper import Mapper


class ArriveMapper (Mapper):
    """Mapper-Klasse, die Arrive-Objekte auf eine relationale Datenbank abbildet.
    Dazu mehrere Methoden, mit deren Hilfe Objekte gesucht, erzeugt, modifiziert und gelöscht werden können.
    Ist bidirektional, Objekte können in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen eines Arrive-Ereignisses mit vorgegebener ID. Rückgabe von genau einem Objekt.

        :param key: Primärschlüsselattribut (->DB)
        :return Arrive-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM arrive WHERE arrive_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (arrive_id, last_edit, time_stamp, affiliated_person_id) = tuples[0]
            arrive = Arrive()
            arrive.set_id(arrive_id)
            arrive.set_last_edit(last_edit)
            arrive.set_time_stamp(time_stamp)
            arrive.set_affiliated_person(affiliated_person_id)

            result = arrive
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_affiliated_person_id(self, key):
        """Suchen aller Arrive-Ereignisse mit vorgegebener zugehöriger Personen ID.

        :param key: Fremdschlüsselattribut (->DB)
        :return Arrive-Objekte, die dem übergebenen Schlüssel entsprechen, None bei nicht vorhandenem DB-Tupel.
        """

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT * FROM arrive WHERE affiliated_person_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (arrive_id, last_edit, time_stamp, affiliated_person_id) in tuples:
            arrive = Arrive()
            arrive.set_id(arrive_id)
            arrive.set_last_edit(last_edit)
            arrive.set_time_stamp(time_stamp)
            arrive.set_affiliated_person(affiliated_person_id)
            result.append(arrive)

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_arrive_by_person(self, key):
        """Suchen eines Arrive-Ereignisses mit der ID der vorgegebenen Person. Rückgabe von genau einem Objekt.

        :param key: Fremdschlüsselattribut (->DB)
        :return Das letzte Arrive-Objekt, das dem Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM arrive WHERE arrive_id = " \
                  "(SELECT MAX(arrive_id) FROM arrive WHERE affiliated_person_id={})".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (arrive_id, last_edit, time_stamp, affiliated_person_id) = tuples[0]
            arrive = Arrive()
            arrive.set_id(arrive_id)
            arrive.set_last_edit(last_edit)
            arrive.set_time_stamp(time_stamp)
            arrive.set_affiliated_person(affiliated_person_id)

            result = arrive
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Arrive-Ereignisse.

        :return Sammlung mit Arrive-Objekten, die sämtliche Arrive-Ereignisse repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from arrive")
        tuples = cursor.fetchall()

        for (arrive_id, last_edit, time_stamp, affiliated_person_id) in tuples:
            arrive = Arrive()
            arrive.set_id(arrive_id)
            arrive.set_last_edit(last_edit)
            arrive.set_time_stamp(time_stamp)
            arrive.set_affiliated_person(affiliated_person_id)
            result.append(arrive)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, arrive):
        """Einfügen eines Arrive-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param arrive: das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(arrive_id) AS maxid FROM arrive")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Start-Objekt zu."""
                arrive.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                arrive.set_id(1)

        command = "INSERT INTO arrive (arrive_id, last_edit, time_stamp, affiliated_person_id) " \
                  "VALUES (%s,%s,%s,%s)"
        data = (arrive.get_id(), arrive.get_last_edit(), arrive.get_time_stamp(), arrive.get_affiliated_person())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return arrive

    def update(self, arrive):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param arrive das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE arrive SET last_edit=%s, time_stamp=%s, affiliated_person_id=%s WHERE arrive_id=%s"
        data = (arrive.get_last_edit(), arrive.get_time_stamp(), arrive.get_affiliated_person(), arrive.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, arrive):
        """Löschen der Daten eines Arrive-Objekts aus der Datenbank.

        :param arrive: das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM arrive WHERE arrive_id={}".format(arrive.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
