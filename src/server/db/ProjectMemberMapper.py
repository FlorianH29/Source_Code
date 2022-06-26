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
        """Suchen Project Member Eintrags mit vorgegebener ID. Rückgabe von genau einem Objekt.

        :param key Primärschlüsselattribut (->DB)
        :return Projekt-Member-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT projectmember_id, project_id, person_id, last_edit FROM projectmembers " \
                  "WHERE projectmember_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (projectmember_id, project_id, person_id, last_edit, deleted) = tuples[0]
            projectmember = ProjectMember()
            projectmember.set_id(projectmember_id)
            projectmember.set_project(project_id)
            projectmember.set_person(person_id)
            projectmember.set_last_edit(last_edit)
            projectmember.set_deleted(deleted)

            result = projectmember
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_person_id(self, key):
        """Suchen Project Member Eintrags mit vorgegebener ID. Rückgabe von genau einem Objekt.

        :param key Primärschlüsselattribut (->DB)
        :return Projekt-Member-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projectmembers " \
                  "WHERE person_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (projectmember_id, project_id, person_id, last_edit, deleted) = tuples[0]
            projectmember = ProjectMember()
            projectmember.set_id(projectmember_id)
            projectmember.set_project(project_id)
            projectmember.set_person(person_id)
            projectmember.set_last_edit(last_edit)
            projectmember.set_deleted(deleted)

            result = projectmember
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_projects_by_person_id(self, key):
        """Suchen eines Project Member Eintrags mit vorgegebener ID.

        :param key Primärschlüsselattribut (->DB)
        :return Projekt-Member-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projectmembers WHERE person_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (projectmember_id, project_id, person_id, last_edit, deleted) in tuples:
            projectmember = ProjectMember()
            projectmember.set_id(projectmember_id)
            projectmember.set_project(project_id)
            projectmember.set_person(person_id)
            projectmember.set_last_edit(last_edit)
            projectmember.set_deleted(deleted)

            result.append(projectmember)

        self._cnx.commit()
        cursor.close()

        return result

    def find_project_members_by_project_id(self, key):
        """Suchen eines ProjectMembers Eintrags mit vorgegebener project_id.

        :param key Fremdschlüsselattribut (->DB)
        :return Projekt-Member-Objekte, die dem übergebenen Schlüssel entsprechen, None bei nicht vorhandenem DB-Tupel.
        """

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projectmembers WHERE project_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (project_member_id, project_id, person_id, last_edit, deleted) in tuples:
            project_member = ProjectMember()
            project_member.set_id(project_member_id)
            project_member.set_project(project_id)
            project_member.set_person(person_id)
            project_member.set_last_edit(last_edit)
            project_member.set_deleted(deleted)

            result.append(project_member)

        self._cnx.commit()
        cursor.close()

        return result



    def insert(self, projectmember):
        """Einfügen eines Project-Member-Objekts in die Datenbank.

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

        command = "INSERT INTO projectmembers (last_edit, project_id, person_id, deleted) " \
                  "VALUES (%s,%s,%s,%s)"
        data = (projectmember.get_last_edit(), projectmember.get_project(),
                projectmember.get_person(), projectmember.get_deleted())
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
        """Setzen der deleted flag auf 1, sodass der Project Member Eintrag nicht mehr ausgegeben wird.

        :param projectmember das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "UPDATE projectmembers SET deleted=1 WHERE projectmember_id={}".format(projectmember.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def delete_by_ids(self, person, project):
        """Setzen der deleted flag auf 1, sodass der Project Member Eintrag nicht mehr ausgegeben wird.

                :param projectmember das aus der DB zu löschende "Objekt"
                """
        cursor = self._cnx.cursor()

        command = "UPDATE projectmembers SET deleted=1 WHERE person_id={} AND project_id={}".format(person.get_id(), project.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
