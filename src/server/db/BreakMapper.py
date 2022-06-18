from server.bo import Break as br
from server.db.Mapper import Mapper


class BreakMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM break WHERE break_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (break_id, last_edit, start_event_id, end_event_id, time_period, deleted) = tuples[0]
            obj = br.Break()
            obj.set_id(break_id)
            obj.set_last_edit(last_edit)
            obj.set_start_event(start_event_id)
            obj.set_end_event(end_event_id)
            obj.set_time_period(time_period)
            obj.set_deleted(deleted)

            result = obj
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_start_event_id(self, start_event_id):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM break WHERE start_event_id={} AND deleted=0".format(start_event_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (break_id, last_edit, start_event_id, end_event_id, time_period, deleted) = tuples[0]
            obj = br.Break()
            obj.set_id(break_id)
            obj.set_last_edit(last_edit)
            obj.set_start_event(start_event_id)
            obj.set_end_event(end_event_id)
            obj.set_time_period(time_period)
            obj.set_deleted(deleted)

            result = obj
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, obj):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(break_id) AS maxid FROM break ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem TimeInterval-Objekt zu."""
                obj.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                obj.set_id(1)

        command = "INSERT INTO break (break_id, last_edit, start_event_id, end_event_id, time_period, deleted) " \
                  "VALUES (%s,%s,%s,%s,%s,%s)"
        data = (obj.get_id(),
                obj.get_last_edit(),
                obj.get_start_event(),
                obj.get_end_event(),
                obj.get_time_period())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return obj

    def update(self, obj):

        cursor = self._cnx.cursor()

        command = "UPDATE break SET last_edit=%s, start_event_id=%s, end_event_id=%s, time_period=%s " \
                  "WHERE break_id=%s"
        data = (obj.get_last_edit(), obj.get_start_event(), obj.get_end_event(), obj.get_time_period(), obj.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, obj):
        """Setzen der deleted flag auf 1, sodass der Break Eintrag nicht mehr ausgegeben wird.
        """
        cursor = self._cnx.cursor()

        command = "UPDATE break SET deleted=1 WHERE break_id={}".format(obj.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
