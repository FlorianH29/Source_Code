from server.bo.Start import Start
from server.db.Mapper import Mapper


class StartMapper (Mapper):
    """Mapper-Klasse, die Start-Ereignis-Objekte auf eine relationale Datenbank abbildet.
    Dazu mehrere Methoden, mit deren Hilfe Objekte gesucht, erzeugt, modifiziert und gelöscht werden können.
    Ist bidirektional, Objekte können in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen eines Start-Ereignisses mit vorgegebener Ereignis ID. Rückgabe von genau einem Objekt.

        :param key: Primärschlüsselattribut (->DB)
        :return Start-Ereignis-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, last_edit, time_stamp FROM Start WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, last_edit, time_stamp) = tuples[0]
            start = Start()
            start.set_id(id)
            start.set_last_edit(last_edit)
            start.set_time_stamp(time_stamp)

            result = start
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Start-Ereignisse.

        :return Sammlung mit Start-Ereignis-Objekten, die sämtliche Start-Ereignisse repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from Start")
        tuples = cursor.fetchall()

        for (id, last_edit, time_stamp) in tuples:
            start = Start()
            start.set_id(id)
            start.set_last_edit(last_edit)
            start.set_time_stamp(time_stamp)
            result.append(start)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, start):
        """Einfügen eines Ereignis-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param start: das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM Start")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            start.set_id(maxid[0]+1)

        """
        Eine Möglichkeit, ein INSERT zu erstellen, ist diese:
            cursor.execute("INSERT INTO persons (id, firstName, lastName) VALUES ('{}','{}','{}')"
                           .format(person.get_id(),person.get_first_name(),person.get_last_name()))
        Dabei wird auf String-Formatierung zurückgegriffen.
        """
        """
        Eine andere Möglichkeit, ist diese:
        """
        command = "INSERT INTO Start (id, last_edit, time_stamp) VALUES (%s,%s,%s)"
        data = (start.get_id(), start.get_last_edit(), start.get_time_stamp())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return start

    def update(self, start):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param start das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE Start " + "SET id=%s, last_edit=%s, time_stamp=%s WHERE id=%s"
        data = (start.get_id(), start.get_last_edit(), start.get_time_stamp())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, start):
        """Löschen der Daten eines Start-Ereignis-Objekts aus der Datenbank.

        :param start: das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM Start WHERE id={}".format(start.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


