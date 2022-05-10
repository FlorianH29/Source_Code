from server.bo.Project import Project
from server.db.Mapper import Mapper


class ProjectMapper (Mapper):
    """Mapper-Klasse, die User-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können. Das Mapping ist bidirektional. D.h., Objekte können
    in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen eines Benutzers mit vorgegebener User ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return User-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, name, client, project_term_id FROM project WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, name, client, project_term) = tuples[0]
            project = Project()
            project.set_id(id)
            project.set_name(name)
            project.set_client(client)
            project.set_project_term(project_term)

            result = project
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        all_projects = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, last_edit, name, client, project_term_id FROM project")
        tuples = cursor.fetchall()

        for (id, last_edit, name, client, project_term_id) in tuples:
            project = Project()
            project.set_id(id)
            project.set_last_edit(last_edit)
            project.set_name(name)
            project.set_client(client)
            project.set_project_term_id(project_term_id)  # muss hier das time_interval via get übergeben werden?
            all_projects.append(project)

        self._cnx.commit()
        cursor.close()

        return all_projects

    def insert(self, obj):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM project ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] in tuples is not None:  # Die Liste beinhaltet min. ein Projekt -> die Id ist somit n+1
                object.set_id(maxid[0] + 1)
            else:  # Die Liste ist leer, somit wird dem neuen Projekt die Id "1" zugewiesen
                object.set_id(1)

        command = "INSERT INTO project (id, last_edit, name, client, project_term_id) VALUES (%s,%s,%s,%a,%s)"
        data = (object.get_id(), object.get_last_edit(), object.get_name(), object.get_client(), object.get_project_term())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return object

    def delete(self, in_project):  # Projekt, welches gelöscht werden soll wird übergeben
        cursor = self._cnx.cursor()

        command = "DELETE FROM project WHERE id={}".format(in_project.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def update(self, in_project):  # Projekt, welches geupdatet werden soll wird übergeben
        cursor = self._cnx.cursor()

        command = "UPDATE project " + "SET name=%s, client=%s, project_term_id WHERE project_id=%s"
        data = (in_project.get_name(), in_project.get_email(), in_project.get_project_term(), in_project.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
