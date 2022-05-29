from server.bo import Project as p
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
        command = "SELECT project_id, last_edit, project_name, client, timeinterval_id, owner " \
                  "FROM project WHERE project_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (project_id, last_edit, project_name, client, timeinterval_id, owner) = tuples[0]
            project = p.Project()
            project.set_id(project_id)
            project.set_last_edit(last_edit)
            project.set_project_name(project_name)
            project.set_client(client)
            project.set_time_interval_id(timeinterval_id)
            project.set_owner(owner)

            result = project
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_person_id(self, person_id):
        """Suchen eines Benutzers mit vorgegebener User ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return User-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        all_projects = []

        cursor = self._cnx.cursor()
        command =   " SELECT DISTINCT P.project_id, P.last_edit, P.project_name, P.client, P.timeinterval_id, P.owner " \
                    " FROM SoPraTestDB.worktimeaccount WTA " \
                    " INNER JOIN SoPraTestDB.Timeintervaltransaction TIT ON TIT.affiliated_work_time_account_id = WTA.worktimeaccount_id " \
                    " INNER JOIN SoPraTestDB.Projectwork PW ON PW.projectwork_id = TIT.affiliated_projectwork_id " \
                    " INNER JOIN SoPraTestDB.activity A ON A.activity_id = PW.affiliated_activity_id " \
                    " INNER JOIN SoPraTestDB.Project P ON P.project_id = A.affiliated_project_id " \
                    " WHERE WTA.person_id = {} " .format(person_id)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (project_id, last_edit, project_name, client, timeinterval_id, owner) in tuples:
            project = p.Project()
            project.set_id(project_id)
            project.set_last_edit(last_edit)
            project.set_project_name(project_name)
            project.set_client(client)
            project.set_time_interval_id(timeinterval_id)
            project.set_owner(owner)
            all_projects.append(project)

        self._cnx.commit()
        cursor.close()

        return all_projects

    def find_all(self):
        all_projects = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT project_id, last_edit, project_name, client, timeinterval_id, owner FROM project")
        tuples = cursor.fetchall()

        for (project_id, last_edit, project_name, client, timeinterval_id, owner) in tuples:
            project = p.Project()
            project.set_id(project_id)
            project.set_last_edit(last_edit)
            project.set_project_name(project_name)
            project.set_client(client)
            project.set_time_interval_id(timeinterval_id)
            project.set_owner(owner)
            all_projects.append(project)

        self._cnx.commit()
        cursor.close()

        return all_projects

    def insert(self, object):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(project_id) AS maxid FROM project ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Project-Objekt zu."""
                object.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                object.set_id(1)

        command = "INSERT INTO project (project_id, last_edit, project_name, client, timeinterval_id, owner)" \
                  " VALUES (%s,%s,%s,%s,%s,%s)"
        data = (object.get_id(),
                object.get_last_edit(),
                object.get_project_name(),
                object.get_client(),
                object.get_time_interval_id(),
                object.get_owner())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return object

    def delete(self, project):  # Projekt, welches gelöscht werden soll wird übergeben
        cursor = self._cnx.cursor()

        command = "DELETE FROM project WHERE project_id={}".format(project.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def update(self, project):  # Projekt, welches als update dient wird hier der Methode übergeben
        cursor = self._cnx.cursor()

        command = "UPDATE project SET last_edit=%s, project_name=%s, client=%s, timeinterval_id=%s, " \
                  "owner=%s WHERE project_id=%s"
        """  
        Die Variablen werden dem übergebenen "project" entnommen und überschreiben die aktuellen Werte, 
        welche im Object mit der entsprechenden id stehen.
        """
        data = (project.get_last_edit(), project.get_project_name(), project.get_client(),
                project.get_timeinterval_id(), project.get_owner(), project.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
