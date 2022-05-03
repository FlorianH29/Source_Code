from server.bo.Event import Event
from server.db.Mapper import Mapper


class EventMapper (Mapper):
    """Mapper-Klasse, die Ereignis-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können. Das Mapping ist bidirektional. D.h., Objekte können
    in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen eines Ereignisses mit vorgegebener Ereignis ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return User-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, last_edit, time_stamp , buchungsid, name FROM Event WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, last_edit, time_stamp, buchungsid, name) = tuples[0]
            event = Event()
            event.set_id(id)
            event.set_name(name)
            event.set_time_stamp(time_stamp)

            result = event
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Ereignisse.

        :return Eine Sammlung mit Ereignis-Objekten, die sämtliche Ereignisse repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from Event")
        tuples = cursor.fetchall()

        for (id, name, lastName) in tuples:
            event = Event()
            event.set_id(id)
            event.set_name(name)
            event.set_time_stamp(lastName)
            result.append(event)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, event):
        """Einfügen eines Ereignis-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param event: das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM Event ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            event.set_id(maxid[0]+1)

        """
        Eine Möglichkeit, ein INSERT zu erstellen, ist diese:
            cursor.execute("INSERT INTO persons (id, firstName, lastName) VALUES ('{}','{}','{}')"
                           .format(person.get_id(),person.get_first_name(),person.get_last_name()))
        Dabei wird auf String-Formatierung zurückgegriffen.
        """
        """
        Eine andere Möglichkeit, ist diese:
        """
        command = "INSERT INTO Event (id, time_stamp, name) VALUES (%s,%s,%s,%s,%s)"
        data = (event.get_id(), event.get_time_stamp(), event.get_name())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return event

    def update(self, event):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param event das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE Event " + "SET id=%s, time_stamp=%s, name=%s WHERE id=%s"
        data = (event.get_id(), event.get_time_stamp(), event.get_name())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, event):
        """Löschen der Daten eines Ereignis-Objekts aus der Datenbank.

        :param event das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM Event WHERE id={}".format(event.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


