from server.bo import ProjectWork as pw
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
        command = "SELECT projectwork_id, last_edit, projectwork_name, description FROM projectwork " \
                  "WHERE projectwork_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (projectwork_id, last_edit, projectwork_name, description) = tuples[0]
            project_work = pw.ProjectWork()
            project_work.set_id(projectwork_id)
            project_work.set_last_edit(last_edit)
            project_work.set_project_work_name(projectwork_name)
            project_work.set_description(description)

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
        cursor.execute("SELECT projectwork_id, last_edit, projectwork_name, description FROM projectwork")
        tuples = cursor.fetchall()

        for (projectwork_id, last_edit, projectwork_name, description) in tuples:
            project_work = pw.ProjectWork()
            project_work.set_id(projectwork_id)
            project_work.set_last_edit(last_edit)
            project_work.set_project_work_name(projectwork_name)
            project_work.set_description(description)
            all_project_works.append(project_work)

        self._cnx.commit()
        cursor.close()

        return all_project_works

    def insert(self, object):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(projectwork_id) AS maxid FROM projectwork ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem ProjectWork-Objekt zu."""
                object.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                object.set_id(1)

        command = "INSERT INTO projectwork (projectwork_id, last_edit, projectwork_name, description, " \
                  "affiliated_activity_id) VALUES (%s,%s,%s,%s,%s)"
        data = (object.get_id(), object.get_last_edit(), object.get_project_work_name(), object.get_description(),
                object.get_affiliated_activity())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return object

    def delete(self, project_work): # Projekt, welches gelöscht werden soll wird übergeben
        cursor = self._cnx.cursor()

        command = "DELETE FROM projectwork WHERE projectwork_id={}".format(project_work.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def update(self, project_work):  # Projekt, welches als update dient wird hier der Methode übergeben
        cursor = self._cnx.cursor()

        command = "UPDATE projectwork SET last_edit=%s, projectwork_name=%s, description=%s, " \
                  "affiliated_activity_id=%s WHERE projectwork_id=%s"
        """  
        Die Variablen werden dem übergebenen "project_work" entnommen und überschreiben die aktuellen Werte, 
        welche im Object mit der entsprechenden id stehen.
        """
        data = (project_work.get_last_edit(), project_work.get_project_work_name(),
                project_work.get_description(), project_work.get_id(), project_work.get_affiliated_activity())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
