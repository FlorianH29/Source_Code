from server.bo import TimeIntervalTransaction as tit
from server.db.Mapper import Mapper


class TimeIntervalTransactionMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen einer Zeitintervall-Buchung mit vorgegebener Nummer. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return TimeIntervalTransaction-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, last_edit, affiliated_work_time_account_id, time_interval FROM Timeintervaltransaction WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (id, last_edit, affiliated_work_time_account_id, time_interval) = tuples[0]
            time_interval_transaction = tit.TimeIntervalTransaction()
            time_interval_transaction.set_id(id)
            time_interval_transaction.set_last_edit(last_edit)
            time_interval_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            time_interval_transaction.set_time_interval(time_interval)

            result = time_interval_transaction
        else:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller TimeIntervalTransactions.

        :return Eine Sammlung mit TimeIntervalTransaction-Objekten, die sämtliche TimeIntervalTransactions
                des Systems repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()

        cursor.execute("SELECT id, last_edit, affiliated_work_time_account_id, time_interval from Timeintervaltransaction")
        tuples = cursor.fetchall()

        for (id, last_edit, affiliated_work_time_account_id, time_interval) in tuples:
            time_interval_transaction = tit.TimeIntervalTransaction()
            time_interval_transaction.set_id(id)
            time_interval_transaction.set_last_edit(last_edit)
            time_interval_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            time_interval_transaction.set_time_interval(time_interval)
            result.append(time_interval_transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_worktimeaccount_id(self, worktimeaccount_id):
        """Auslesen aller TimeIntervalTransactions eines durch Fremdschlüssel (worktimeaccountid) gegebenen WorkTimeAccounts.

        :param worktimeaccount_id Schlüssel des zugehörigen Kontos.
        :return Eine Sammlung mit TimeIntervalTransaction-Objekten.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, last_edit, affiliated_work_time_account_id, time_interval FROM Timeintervaltransaction WHERE affiliatedworktimeaccountid={} ORDER BY id".format(
            worktimeaccount_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, last_edit, affiliated_work_time_account_id, time_interval) in tuples:
            time_interval_transaction = tit.TimeIntervalTransaction()
            time_interval_transaction.set_id(id)
            time_interval_transaction.set_last_edit(last_edit)
            time_interval_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            time_interval_transaction.set_time_interval(time_interval)
            result.append(time_interval_transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, time_interval_transaction):
        """Einfügen eines TimeIntervalTransaction-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param timeintervaltransaction das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM Timeintervaltransaction ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            time_interval_transaction.set_id(maxid[0] + 1)

        command = "INSERT INTO Timeintervaltransaction (id, last_edit, affiliated_work_time_account_id, time_interval) VALUES (%s,%s,%s,%s)"
        data = (time_interval_transaction.get_id(),
                time_interval_transaction.get_last_edit(),
                time_interval_transaction.get_affiliated_work_time_account(),
                time_interval_transaction.get_time_interval())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return time_interval_transaction

    def update(self, time_interval_transaction):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param timeintervaltransaction das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE Timeintervaltransaction " + "SET id=%s, last_edit=%s, affiliated_work_time_account_id=%s, time_interval=%s WHERE id=%s"
        data = (time_interval_transaction.get_id(),
                time_interval_transaction.get_last_edit(),
                time_interval_transaction.get_affiliated_work_time_account(),
                time_interval_transaction.get_time_interval())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, time_interval_transaction):
        """Löschen der Daten eines TimeIntervalTransaction-Objekts aus der Datenbank.

        :param timeintervaltransaction das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM Timeintervaltransaction WHERE id={}".format(time_interval_transaction.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with TimeIntervalTransactionMapper() as mapper:
        result = mapper.find_all()
        for t in result:
            print(t)