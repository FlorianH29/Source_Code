from server.bo import TimeInterval as ti
from server.db.Mapper import Mapper


class TimeIntervalMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM timeinterval WHERE timeinterval_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (timeinterval_id, last_edit, start_event_id, end_event_id, time_period, arrive_id, departure_id) = tuples[0]
            interval = ti.TimeInterval()
            interval.set_id(timeinterval_id)
            interval.set_last_edit(last_edit)
            interval.set_start_event(start_event_id)
            interval.set_end_event(end_event_id)
            interval.set_time_period(time_period)
            interval.set_arrive(arrive_id)
            interval.set_departure(departure_id)

            result = interval
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_arrive_id(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM timeinterval WHERE arrive_id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (timeinterval_id, last_edit, start_event_id, end_event_id, time_period, arrive_id, departure_id) = tuples[0]
            interval = ti.TimeInterval()
            interval.set_id(timeinterval_id)
            interval.set_last_edit(last_edit)
            interval.set_start_event(start_event_id)
            interval.set_end_event(end_event_id)
            interval.set_time_period(time_period)
            interval.set_arrive(arrive_id)
            interval.set_departure(departure_id)

            result = interval
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

        result = []

        cursor = self._cnx.cursor()
        command = " SELECT DISTINCT TI.timeinterval_id, TI.last_edit, TI.start_event_id, TI.end_event_id, " \
                  " TI.time_period, TI.arrive_id, TI.departure_id FROM SoPraTestDB.worktimeaccount WTA " \
                  " INNER JOIN SoPraTestDB.Timeintervaltransaction TIT ON TIT.affiliated_work_time_account_id = WTA.worktimeaccount_id " \
                  " INNER JOIN SoPraTestDB.Timeinterval TI ON TIT.affiliated_time_interval_id = TI.timeinterval_id " \
                  " WHERE WTA.person_id = {} ".format(person_id)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (timeinterval_id, last_edit, start_event_id, end_event_id, time_period, arrive_id, departure_id) in tuples:
            interval = ti.TimeInterval()
            interval.set_id(timeinterval_id)
            interval.set_last_edit(last_edit)
            interval.set_start_event(start_event_id)
            interval.set_end_event(end_event_id)
            interval.set_time_period(time_period)
            interval.set_arrive(arrive_id)
            interval.set_departure(departure_id)
            result.append(interval)

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

        command = "INSERT INTO timeinterval (timeinterval_id, last_edit, start_event_id, end_event_id, time_period, " \
                  "arrive_id, departure_id ) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (time_interval.get_id(),
                time_interval.get_last_edit(),
                time_interval.get_start_event(),
                time_interval.get_end_event(),
                time_interval.get_time_period(),
                time_interval.get_arrive(),
                time_interval.get_departure())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return time_interval

    def update(self, time_interval):

        cursor = self._cnx.cursor()

        command = "UPDATE timeinterval SET last_edit=%s, start_event_id=%s, end_event_id=%s, time_period=%s, " \
                  "arrive_id=%s, departure_id=%s WHERE timeinterval_id=%s"
        data = (time_interval.get_last_edit(), time_interval.get_start_event(),
                time_interval.get_end_event(), time_interval.get_time_period(), time_interval.get_arrive(),
                time_interval.get_departure(), time_interval.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, time_interval):
        """Löschen der Daten eines Zeitintervalls aus der Datenbank.
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM timeinterval WHERE timeinterval_id={}".format(time_interval.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
