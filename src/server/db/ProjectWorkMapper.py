from server.bo import ProjectWork as pw
from server.db.Mapper import Mapper


class ProjectWorkMapper (Mapper):
    """Mapper-Klasse, die ProjectWork-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können. Das Mapping ist bidirektional. D.h., Objekte können
    in DB-Strukturen und DB-Strukturen in Objekte umgewandelt werden.
    """

    def __init__(self):
        super().__init__()

    def find_by_activity(self, activity):
        """Suchen von ProjectWork Objekten mit vorgegebener Aktivität.

        :param activity ID der Aktivität, mit der zugehörigege ProjectWorks eindeutig in der DB gefunden werden können
        :return ProjectWork-Objekte, die der der Aktivität zugeordnet werden können
        """

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projectwork WHERE affiliated_activity_id={} AND deleted=0".format(activity)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (projectwork_id, last_edit, projectwork_name, description, start_event, end_event, time_period,
             affiliated_activity_id, deleted) in tuples:
            project_work = pw.ProjectWork()
            project_work.set_id(projectwork_id)
            project_work.set_last_edit(last_edit)
            project_work.set_project_work_name(projectwork_name)
            project_work.set_description(description)
            project_work.set_start_event(start_event)
            project_work.set_end_event(end_event)
            project_work.set_time_period(time_period)
            project_work.set_affiliated_activity(affiliated_activity_id)
            project_work.set_deleted(deleted)
            result.append(project_work)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_start_event(self, key):
        """Suchen eines ProjectWorks mit vorgegebener ID des Start Events. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Fremdschlüsselattribut, mit dem das Project_Work eindeutig in DB gefunden werden kann
        :return ProjectWork-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projectwork WHERE start_event_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (projectwork_id, last_edit, projectwork_name, description, start_event, end_event, time_period,
             affiliated_activity_id, deleted) = tuples[0]
            project_work = pw.ProjectWork()
            project_work.set_id(projectwork_id)
            project_work.set_last_edit(last_edit)
            project_work.set_project_work_name(projectwork_name)
            project_work.set_description(description)
            project_work.set_start_event(start_event)
            project_work.set_end_event(end_event)
            project_work.set_time_period(time_period)
            project_work.set_affiliated_activity(affiliated_activity_id)
            project_work.set_deleted(deleted)

            result = project_work
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_end_event(self, key):
        """Suchen eines ProjectWorks mit vorgegebener ID des End Events. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Fremdschlüsselattribut, mit dem das Project_Work eindeutig in DB gefunden werden kann
        :return ProjectWork-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projectwork WHERE end_event_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (projectwork_id, last_edit, projectwork_name, description, start_event, end_event, time_period,
             affiliated_activity_id, deleted) = tuples[0]
            project_work = pw.ProjectWork()
            project_work.set_id(projectwork_id)
            project_work.set_last_edit(last_edit)
            project_work.set_project_work_name(projectwork_name)
            project_work.set_description(description)
            project_work.set_start_event(start_event)
            project_work.set_end_event(end_event)
            project_work.set_time_period(time_period)
            project_work.set_affiliated_activity(affiliated_activity_id)
            project_work.set_deleted(deleted)

            result = project_work
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen eines ProjectWorks mit vorgegebener ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut, mit dem das Project_Work eindeutig in DB gefunden werden kann
        :return ProjectWork-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projectwork WHERE projectwork_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (projectwork_id, last_edit, projectwork_name, description, start_event, end_event, time_period,
             affiliated_activity_id, deleted) = tuples[0]
            project_work = pw.ProjectWork()
            project_work.set_id(projectwork_id)
            project_work.set_last_edit(last_edit)
            project_work.set_project_work_name(projectwork_name)
            project_work.set_description(description)
            project_work.set_start_event(start_event)
            project_work.set_end_event(end_event)
            project_work.set_time_period(time_period)
            project_work.set_affiliated_activity(affiliated_activity_id)
            project_work.set_deleted(deleted)

            result = project_work
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, project_work):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(projectwork_id) AS maxid FROM projectwork ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem ProjectWork-Objekt zu."""
                project_work.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                project_work.set_id(1)

        command = "INSERT INTO projectwork (projectwork_id, last_edit, projectwork_name, description, " \
                  "start_event_id, end_event_id, time_period, affiliated_activity_id, deleted) " \
                  "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        data = (project_work.get_id(), project_work.get_last_edit(), project_work.get_project_work_name(),
                project_work.get_description(), project_work.get_start_event(), project_work.get_end_event(),
                project_work.get_time_period(), project_work.get_affiliated_activity(), project_work.get_deleted())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return project_work

    def delete(self, project_work):  # Projektarbeit, welches gelöscht werden soll wird übergeben
        cursor = self._cnx.cursor()

        command = "UPDATE projectwork SET deleted=1 WHERE projectwork_id={}".format(project_work.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def update(self, project_work):  # Projektarbeit, welche als update dient wird hier der Methode übergeben
        cursor = self._cnx.cursor()

        command = "UPDATE projectwork SET last_edit=%s, projectwork_name=%s, description=%s, start_event_id=%s, " \
                  "end_event_id=%s, time_period=%s,affiliated_activity_id=%s WHERE projectwork_id=%s"
        """  
        Die Variablen werden dem übergebenen "project_work" entnommen und überschreiben die aktuellen Werte, 
        welche im Object mit der entsprechenden id stehen.
        """
        data = (project_work.get_last_edit(), project_work.get_project_work_name(), project_work.get_description(),
                project_work.get_start_event(), project_work.get_end_event(), project_work.get_time_period(),
                project_work.get_affiliated_activity(), project_work.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
