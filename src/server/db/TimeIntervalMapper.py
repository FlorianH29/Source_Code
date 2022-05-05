from server.bo.TimeInterval import TimeInterval
from server.db.Mapper import Mapper


class TimeIntervalMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from TimeInterval")
        tuples = cursor.fetchall()

        for (id, last_edit, start_time, end_time, time_interval) in tuples:
            time_interval = TimeInterval()
            time_interval.set_id(id)
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
        command = "SELECT id, last_edit, start_time, end_time, time_interval FROM TimeInterval WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, last_edit, start_time, end_time, time_interval) = tuples[0]
            time_interval = TimeInterval()
            time_interval.set_id(id)
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
        cursor.execute("SELECT MAX(id) AS maxid FROM TimeInterval ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            time_interval.set_id(maxid[0] + 1)

        command = "INSERT INTO TimeInterval (id, last_edit, start_time, end_time, time_interval) VALUES (%s,%s,%s,%s,%s)"
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

        command = "UPDATE time_interval " + "SET id=%s, last_edit=%s, start_time=%s, end_time=%s, time_interval=%s, WHERE id=%s"
        data = (time_interval.get_id(), time_interval.get_last_edit(), time_interval.get_start_time(),
                time_interval.get_end_time(), time_interval.get_time_interval())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, time_interval):
        """Löschen der Daten eines Zeitinterval aus der Datenbank.
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM TimeInterval WHERE id={}".format(time_interval.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with TimeIntervalMapper() as mapper:
        result = mapper.find_all()
        for k in result:
            print(k)

