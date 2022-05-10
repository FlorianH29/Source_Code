from server.bo.ProjectWork import ProjectWork
from server.db.Mapper import Mapper


class ProjectWorkMapper (Mapper):
    """Mapper-Klasse, die User-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können. Das Mapping ist bidirektional. D.h., Objekte können
    in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen eines ProjectWorks mit vorgegebener ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut, mit dem das Project_Work eindeutig in DB gefunden werden kann
        :return ProjectWork-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, name, description, activityid FROM Projectwork WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, name, description, activityid) = tuples[0]
            project_work = ProjectWork()
            project_work.set_id(id)
            project_work.set_name(name)
            project_work.set_description(description)
            project_work.set_affiliated_activity(activityid)

            result = project_work
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result


    def find_all(self):
        all_project_works = []  # Liste mit allen "project_works
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, last_edit, name, description FROM Projectwork")
        tuples = cursor.fetchall()

        for (id, last_edit, name, description) in tuples:
            project_work = ProjectWork()
            project_work.set_id(id)
            project_work.set_last_edit(last_edit)
            project_work.set_name(name)
            project_work.set_description(description)
            all_project_works.append(project_work)

        self._cnx.commit()
        cursor.close()

        return all_project_works

    def insert(self, object):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM Projectwork ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] in tuples is not None:  # Die Liste beinhaltet min. ein Projekt -> die Id ist somit n+1
                object.set_id(maxid[0] + 1)
            else:  # Die Liste ist leer, somit wird dem neuen Projekt die Id "1" zugewiesen
                object.set_id(1)

        command = "INSERT INTO project_work (id, last_edit, name, description) VALUES (%s,%s,%s,%s)"
        data = (object.get_id(), object.get_last_edit(), object.get_name(), object.get_description())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return object

    def delete(self, in_project_work): # Projekt, welches gelöscht werden soll wird übergeben
        cursor = self._cnx.cursor()

        command = "DELETE FROM Projectwork WHERE id={}".format(in_project_work.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def update(self, in_project_work):  # Projekt, welches geupdatet werden soll wird übergeben
        cursor = self._cnx.cursor()

        command = "UPDATE Projectwork " + "SET name=%s, description=%s WHERE project_work_id=%s"
        data = (in_project_work.get_name(), in_project_work.get_description(), in_project_work.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
