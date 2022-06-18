from server.bo.Departure import Departure
from server.db.Mapper import Mapper


class DepartureMapper (Mapper):
    """Mapper-Klasse, die Departure-Objekte auf eine relationale Datenbank abbildet.
    Dazu mehrere Methoden, mit deren Hilfe Objekte gesucht, erzeugt, modifiziert und gelöscht werden können.
    Ist bidirektional, Objekte können in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen eines Departure-Ereignisses mit vorgegebener Ereignis ID. Rückgabe von genau einem Objekt.

        :param key Primärschlüsselattribut (->DB)
        :return End-Ereignis-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM departure WHERE departure_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (departure_id, last_edit, time_stamp, affiliated_person_id, deleted) = tuples[0]
            departure = Departure()
            departure.set_id(departure_id)
            departure.set_last_edit(last_edit)
            departure.set_time_stamp(time_stamp)
            departure.set_affiliated_person(affiliated_person_id)
            departure.set_deleted(deleted)

            result = departure
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_affiliated_person_id(self, key):
        """Suchen eines Departure-Ereignisses mit vorgegebener zugehöriger Personen ID. Rückgabe von genau einem Objekt.

        :param key Fremdschlüsselattribut (->DB)
        :return End-Ereignis-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM departure WHERE affiliated_person_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (departure_id, last_edit, time_stamp, affiliated_person_id, deleted) = tuples[0]
            departure = Departure()
            departure.set_id(departure_id)
            departure.set_last_edit(last_edit)
            departure.set_time_stamp(time_stamp)
            departure.set_affiliated_person(affiliated_person_id)
            departure.set_deleted(deleted)

            result = departure
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_last_departure_by_person(self, key):
        """Suchen eines Departure-Ereignisses mit der ID der vorgegebenen Person. Rückgabe von genau einem Objekt.

        :param key: Fremdschlüsselattribut (->DB)
        :return Das letzte Departure-Objekt, das dem Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM departure WHERE departure_id = " \
                  "(SELECT MAX(departure_id) FROM departure WHERE affiliated_person_id={} AND deleted=0)".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (departure_id, last_edit, time_stamp, affiliated_person_id) = tuples[0]
            departure = Departure()
            departure.set_id(departure_id)
            departure.set_last_edit(last_edit)
            departure.set_time_stamp(time_stamp)
            departure.set_affiliated_person(affiliated_person_id)

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

        :return  Sammlung mit End-Ereignis-Objekten, die sämtliche nicht gelöschte End-Ereignisse repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from departure")
        tuples = cursor.fetchall()

        for (departure_id, last_edit, time_stamp, affiliated_person_id) in tuples:
            departure = Departure()
            departure.set_id(departure_id)
            departure.set_last_edit(last_edit)
            departure.set_time_stamp(time_stamp)
            departure.set_affiliated_person(affiliated_person_id)
            result.append(departure)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, departure):
        """Einfügen eines End-Ereignis-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf. berichtigt.

        :param departure: das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(departure_id) AS maxid FROM departure")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem End-Objekt zu."""
                departure.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                departure.set_id(1)

        command = "INSERT INTO departure (departure_id, last_edit, time_stamp, affiliated_person_id) " \
                  "VALUES (%s,%s,%s,%s)"
        data = (departure.get_id(), departure.get_last_edit(), departure.get_time_stamp(),
                departure.get_affiliated_person())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return departure

    def update(self, departure):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param departure das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE departure SET last_edit=%s, time_stamp=%s, affiliated_person_id=%s WHERE departure_id=%s"
        data = (departure.get_last_edit(), departure.get_time_stamp(), departure.get_affiliated_person(), departure.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, departure):
        """Setzen der deleted flag auf 1, sodass der Departure Eintrag nicht mehr ausgegeben wird.

        :param departure das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "UPDATE departure SET deleted=1 WHERE departure_id={}".format(departure.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
