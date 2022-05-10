from server.bo import Person as p
from server.db.Mapper import Mapper


class PersonMapper(Mapper):
    """Mapper-Klasse, die User-Objekte auf eine relationale
    Datenbank abbildet.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Mitarbeiter.

        :return Eine Sammlung mit Personen-Objekten, die sämtliche Kunden
                repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from Person")
        tuples = cursor.fetchall()

        for (id, firstName, lastName, username, mailaddress, person_id) in tuples:
            employee = p.Person()
            employee.set_id(id)
            employee.set_firstname(firstName)
            employee.set_lastname(lastName)
            employee.set_username(username)
            employee.set_mailaddress(mailaddress)
            employee.set_person_id(person_id)
            result.append(employee)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen eines Benutzers mit vorgegebener User ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return User-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, firstname, lastname, mailaddress, username, person_id FROM Person WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, firstname, lastname, mailaddress, username, person_id) = tuples[0]
            employee = p.Person()
            employee.set_person_id(id)
            employee.set_firstname(firstname)
            employee.set_lastname(lastname)
            employee.set_mailaddress(mailaddress)
            employee.set_username(username)

            result = employee
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, employee):
        """Einfügen eines Person-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param employee das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM Person ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                employee.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                employee.set_id(1)

        """
        INSERT-Befehl um ein Personen Objekt in die Datenbank zu schreiben
        FRAGE: ob die externe Personen ID hier dazukommt noch klären!
        """
        command = "INSERT INTO Person (id, last_edit, firstname, lastname, username, mailaddress, person_id) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (employee.get_id(),
                employee.get_last_edit(),
                employee.get_firstname(),
                employee.get_lastname(),
                employee.get_username(),
                employee.get_mailaddress(),
                employee.get_person_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return employee

    def update(self, employee):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param employee das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE Person " + "SET firstName=%s, lastName=%s, username=%s, mailaddress=%s," \
                                     "person_id=%s WHERE id=%s"
        data = (employee.get_first_name(), employee.get_last_name(), employee.get_username, employee.get_mailadress,
                employee.get_id(), employee.get_person_id)
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, employee):
        """Löschen der Daten eines Customer-Objekts aus der Datenbank.

        :param employee das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM Person WHERE id={}".format(employee.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


"""if (__name__ == "__main__"):
    with PersonMapper() as mapper:
        result = mapper.find_all()
        for t in result:
            print(t)"""
