from server.bo import Person as p
from server.db.Mapper import Mapper


from src.server.bo.Person import Person


class PersonMapper(Mapper):
    """Mapper-Klasse, die Personen-Objekte auf eine relationale
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
        cursor.execute("SELECT * from person WHERE deleted=0")
        tuples = cursor.fetchall()

        for (person_id, last_edit, firstName, lastName, username, mailaddress, firebase_id) in tuples:
            employee = p.Person()
            employee.set_id(person_id)
            employee.set_last_edit(last_edit)
            employee.set_firstname(firstName)
            employee.set_lastname(lastName)
            employee.set_username(username)
            employee.set_mailaddress(mailaddress)
            employee.set_firebase_id(firebase_id)
            result.append(employee)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_arrive(self):
        """Auslesen aller Mitarbeiter, welche am entsprechenden Tag eingecheckt haben.

        :return Eine Sammlung mit Personen-Objekten, die sämtliche Kunden
                repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT  P.* FROM person P "
                       "inner join arrive A on A.affiliated_person_id = P.person_id "
                       "inner join departure D on D.affiliated_person_id = P.person_id "
                       "WHERE P.deleted=0 "
                       "GROUP BY P.person_id "
                       "HAVING MAX(A.time_stamp) > MAX(D.time_stamp);")
        tuples = cursor.fetchall()

        for (person_id, last_edit, firstName, lastName, username, mailaddress, firebase_id, deleted) in tuples:
            employee = p.Person()
            employee.set_id(person_id)
            employee.set_last_edit(last_edit)
            employee.set_firstname(firstName)
            employee.set_lastname(lastName)
            employee.set_username(username)
            employee.set_mailaddress(mailaddress)
            employee.set_firebase_id(firebase_id)
            employee.set_deleted(deleted)
            result.append(employee)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen einer Person mit vorgegebener person_id. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return Person-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT person_id, last_edit, firstname, lastname, mailaddress, username, firebase_id, deleted " \
                  "FROM person WHERE person_id={} AND deleted = 0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (person_id, last_edit, firstname, lastname, mailaddress, username, firebase_id, deleted) = tuples[0]
            employee = p.Person()
            employee.set_id(person_id)
            employee.set_last_edit(last_edit)
            employee.set_firstname(firstname)
            employee.set_lastname(lastname)
            employee.set_mailaddress(mailaddress)
            employee.set_username(username)
            employee.set_firebase_id(firebase_id)
            employee.set_deleted(deleted)

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
        cursor.execute("SELECT MAX(person_id) AS maxid FROM person ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Person-Objekt zu."""
                employee.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                employee.set_id(1)

        """
        INSERT-Befehl um ein Personen Objekt in die Datenbank zu schreiben
        FRAGE: ob die externe Personen ID hier dazukommt noch klären!
        """
        command = "INSERT INTO person (person_id, last_edit, firstname, lastname, username, mailaddress, firebase_id, deleted) " \
                  "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        data = (employee.get_id(),
                employee.get_last_edit(),
                employee.get_firstname(),
                employee.get_lastname(),
                employee.get_username(),
                employee.get_mailaddress(),
                employee.get_firebase_id(),
                employee.get_deleted())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return employee

    def update(self, employee):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param employee das Objekt, das in die DB geschrieben werden soll
        """

        cursor = self._cnx.cursor()

        command = "UPDATE person SET firstName=%s, last_edit=%s, lastName=%s, username=%s, mailaddress=%s," \
                  "firebase_id=%s WHERE person_id=%s"

        data = (employee.get_firstname(), employee.get_last_edit(), employee.get_lastname(), employee.get_username(),
                employee.get_mailaddress(), employee.get_firebase_id(), employee.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def find_by_firebase_id(self, key):
        """Suchen einer Person mit vorgegebener Firebase id. Da diese wegen der Löschlogik nicht eindeutig ist,
        muss noch nach deleted=0  efiltert werden. So wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return Person-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT person_id, last_edit, firstname, lastname, mailaddress, username, firebase_id, deleted " \
                  "FROM person WHERE firebase_id='{}' AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (person_id, last_edit, firstname, lastname, mailaddress, username, firebase_id, deleted) = tuples[0]
            person = p.Person()
            person.set_id(person_id)
            person.set_last_edit(last_edit)
            person.set_firstname(firstname)
            person.set_lastname(lastname)
            person.set_mailaddress(mailaddress)
            person.set_username(username)
            person.set_firebase_id(firebase_id)
            person.set_deleted(deleted)

            result = person
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None


        self._cnx.commit()
        cursor.close()

        return result

    def find_persons_by_project_id(self, key):
        """Suchen von Personen die nicht in einem Projekt sind.

        :param key Fremdschlüsselattribut (->DB)
        :return Person-Objekte, die dem übergebenen Schlüssel entsprechen, None bei nicht vorhandenem DB-Tupel.
        """

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT * FROM person WHERE person_id " \
                  "NOT IN (SELECT person_id FROM projectmembers WHERE project_id={} AND deleted = 0)".format(key)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (person_id, last_edit, firstName, lastName, username, mailaddress, firebase_id, deleted) in tuples:
            employee = p.Person()
            employee.set_id(person_id)
            employee.set_last_edit(last_edit)
            employee.set_firstname(firstName)
            employee.set_lastname(lastName)
            employee.set_username(username)
            employee.set_mailaddress(mailaddress)
            employee.set_firebase_id(firebase_id)
            employee.set_deleted(deleted)


            result.append(employee)

        self._cnx.commit()
        cursor.close()

        return result

    def delete(self, employee):
        """Setzen der deleted flag auf 1, sodass der Person Eintrag nicht mehr ausgegeben wird.

        :param employee das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "UPDATE person SET deleted=1 WHERE person_id={}".format(employee.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()



