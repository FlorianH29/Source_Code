from abc import ABC

from server.bo.ProjectMember import ProjectMember
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
        command = "SELECT project_id, person_id FROM projectmembers WHERE projectmember_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (projectmember_id, last_edit, project_id, person_id) = tuples[0]
            projectmember = ProjectMember()
            projectmember.set_id(projectmember_id)
            projectmember.set_last_edit(last_edit)
            projectmember.set_project(project_id)
            projectmember.set_person(person_id)

            result = projectmember
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, projectmember):
        """Einfügen eines Project-Member-Ereignis-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf. berichtigt.

        :param projectmember: das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(projectmember_id) AS maxid FROM projectmembers")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem End-Objekt zu."""
                projectmember.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                projectmember.set_id(1)

        command = "INSERT INTO projectmembers (projectmember_id, last_edit, project_id, person_id) VALUES (%s,%s,%s,%s)"
        data = (projectmember.get_id(), projectmember.get_last_edit(), projectmember.get_project(), projectmember.get_person())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return projectmember

    def update(self, projectmember):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param projectmember das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE projectmembers SET last_edit=%s, project_id=%s, person_id=%s WHERE projectmember_id=%s"
        data = (projectmember.get_last_edit(), projectmember.get_project(), projectmember.get_person(), projectmember.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, projectmember):
        """Löschen der Daten eines Project-Member-Objekts aus der Datenbank.

        :param projectmember das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM projectmembers WHERE projectmember_id={}".format(projectmember.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
