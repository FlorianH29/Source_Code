from server.bo import TimeInterval as ti
from server.db.Mapper import Mapper


class TimeIntervalMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from timeinterval")
        tuples = cursor.fetchall()

        for (timeinterval_id, last_edit, start_time, end_time, time_interval) in tuples:
            time_interval = ti.TimeInterval()
            time_interval.set_id(timeinterval_id)
            time_interval.set_last_edit(last_edit)
            time_interval.set_start_time(start_time)
            time_interval.set_end_time(end_time)
            time_interval.set_time_interval(time_interval)
            result.append(time_interval)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT timeinterval_id, last_edit, start_time, end_time, time_interval FROM timenterval " \
                  "WHERE time_interval_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (timeinterval_id, last_edit, start_time, end_time, time_interval) = tuples[0]
            time_interval = ti.TimeInterval()
            time_interval.set_id(timeinterval_id)
            time_interval.set_last_edit(last_edit)
            time_interval.set_start_time(start_time)
            time_interval.set_end_time(end_time)
            time_interval.set_time_interval(time_interval)

            result = time_interval
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, time_interval):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(timeinterval_id) AS maxid FROM timeinterval ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem TimeInterval-Objekt zu."""
                time_interval.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                time_interval.set_id(1)

        command = "INSERT INTO timeinterval (timeinterval_id, last_edit, start_time, end_time, time_interval)" \
                  " VALUES (%s,%s,%s,%s,%s)"
        data = (time_interval.get_id(),
                time_interval.get_last_edit(),
                time_interval.get_start_time(),
                time_interval.get_end_time(),
                time_interval.egt_time_interval())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return time_interval

    def update(self, time_interval):

        cursor = self._cnx.cursor()

        command = "UPDATE timeinterval " + "SET timeinterval_id=%s, last_edit=%s, start_time=%s, end_time=%s, " \
                                           "time_interval=%s, WHERE time_interval_id=%s"
        data = (time_interval.get_id(), time_interval.get_last_edit(), time_interval.get_start_time(),
                time_interval.get_end_time(), time_interval.get_time_interval())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, time_interval):
        """Löschen der Daten eines Zeitinterval aus der Datenbank.
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM timeinterval WHERE timeinterval_id={}".format(time_interval.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with TimeIntervalMapper() as mapper:
        result = mapper.find_all()
        for k in result:
            print(k)
