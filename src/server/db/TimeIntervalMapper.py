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

        for (id, last_edit, start_event, end_event, time_stamp) in tuples:
            timeinterval = TimeInterval()
            timeinterval.set_id(id)
            timeinterval.set_last_edit(last_edit)
            timeinterval.set_start_event(start_event)
            timeinterval.set_end_event(end_event)
            timeinterval.set_time_stamp(time_stamp)
            result.append(timeinterval)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, last_edit, start_event, end_event, time_stamp FROM TimeInterval WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, last_edit, start_event, end_event, time_stamp) = tuples[0]
            timeinterval = TimeInterval()
            timeinterval.set.id(id)
            timeinterval.set.last_edit(last_edit)
            timeinterval.set.start_event(start_event)
            timeinterval.set_end_event(end_event)
            timeinterval.set_time_stamp(time_stamp)

            result = timeinterval
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, timeinterval):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM TimeInterval ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            timeinterval.set_id(maxid[0] + 1)

        command = "INSERT INTO TimeInterval (id, last_edit, start_event, end_event, time_stamp) VALUES (%s,%s,%s,%s)"
        data = (timeinterval.get_id(),
                timeinterval.get_last_edit(),
                timeinterval.get_start_event(),
                timeinterval.get_end_event(),
                timeinterval.egt_time_stamp())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return timeinterval

    def update(self, timeinterval):

        cursor = self._cnx.cursor()

        command = "UPDATE timeinterval " + "SET id=%s, last_edit=%s, start_event=%s, end_event=%s, time_stamp=%s, WHERE id=%s"
        data = (timeinterval.get_id(), timeinterval.get_last_edit(), timeinterval.get_start_event(),
                timeinterval.get_end_event(), timeinterval.get_time_stamp())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, timeinterval):
        """Löschen der Daten eines Zeitinterval aus der Datenbank.
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM TimeInterval WHERE id={}".format(timeinterval.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with TimeIntervalMapper() as mapper:
        result = mapper.find_all()
        for k in result:
            print(k)

