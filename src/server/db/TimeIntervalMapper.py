from server.bo.TimeInterval import TimeInterval
from server.db.Mapper import Mapper

class TimeIntervalMapper(Mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from Zeitintervall")
        tuples = cursor.fetchall()

        for (id, last_edit, ereignisid, projektid) in tuples:
            timeinterval = TimeInterval()
            timeinterval.set_id(id)
            timeinterval.set_last_edit(last_edit)
            timeinterval.set_ereignisid(ereignisid)
            timeinterval.set_projektid(projektid)
            result.append(timeinterval)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, last_edit, ereignisid, projektid FROM Zeitinervall WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (id, last_edit, ereignisid, projektid) = tuples[0]
            timeinterval = TimeInterval()
            timeinterval.set_id(id)
            timeinterval.set_last_edit(last_edit)
            timeinterval.set_ereignisid(ereignisid)
            timeinterval.set_projektid(projektid)

            result = timeinterval
        else:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, timeinterval):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM Zeitintervall ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            timeinterval.set_id(maxid[0] + 1)

        command = "INSERT INTO timeinterval (id, last_edit, ereignisid, projektid) VALUES (%s,%s,%s,%s)"
        data = (timeinterval.get_id(),
                timeinterval.get_last_edit(),
                timeinterval.get_ereignisid(),
                timeinterval.get_projektid())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return timeinterval

    def update(self, interval):

        cursor = self._cnx.cursor()

        command = "UPDATE interval " + "SET ereignisid=%s, last_edit=%s WHERE id=%s"
        data = (interval.get_id(), interval.get_last_edit(), interval.get_ereignisid, interval.get_projektid())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, timeinterval):
        """Löschen der Daten eines Zeitinterval aus der Datenbank.
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM Zeitintervall WHERE id={}".format(timeinterval.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

if (__name__ == "__main__"):
    with TimeIntervalMapper() as mapper:
        result = mapper.find_all()
        for k in result:
            print(k)
