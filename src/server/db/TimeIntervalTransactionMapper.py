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
        command = "SELECT * FROM timeintervaltransaction WHERE timeintervaltransaction_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (timeintervaltransaction_id, last_edit, affiliated_work_time_account_id, affiliated_time_interval_id,
             affiliated_break_id, affiliated_projectwork_id, deleted) = tuples[0]
            time_interval_transaction = tit.TimeIntervalTransaction()
            time_interval_transaction.set_id(timeintervaltransaction_id)
            time_interval_transaction.set_last_edit(last_edit)
            time_interval_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            time_interval_transaction.set_affiliated_time_interval(affiliated_time_interval_id)
            time_interval_transaction.set_affiliated_break(affiliated_break_id)
            time_interval_transaction.set_affiliated_projectwork(affiliated_projectwork_id)
            time_interval_transaction.set_deleted(deleted)

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

        cursor.execute(
            "SELECT * FROM timeintervaltransaction WHERE deleted=0")
        tuples = cursor.fetchall()

        for (timeintervaltransaction_id, last_edit, affiliated_work_time_account_id, affiliated_time_interval_id,
             affiliated_break_id, affiliated_projectwork_id, deleted) in tuples:
            time_interval_transaction = tit.TimeIntervalTransaction()
            time_interval_transaction.set_id(timeintervaltransaction_id)
            time_interval_transaction.set_last_edit(last_edit)
            time_interval_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            time_interval_transaction.set_affiliated_time_interval(affiliated_time_interval_id)
            time_interval_transaction.set_affiliated_break(affiliated_break_id)
            time_interval_transaction.set_affiliated_projectwork(affiliated_projectwork_id)
            time_interval_transaction.set_deleted(deleted)

            result.append(time_interval_transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_affiliated_work_time_account_id(self, worktimeaccount_id):
        """Auslesen aller TimeIntervalTransactions eines durch Fremdschlüssel (worktimeaccountid) gegebenen WorkTimeAccounts.

        :param worktimeaccount_id Schlüssel des zugehörigen Kontos.
        :return Eine Sammlung mit TimeIntervalTransaction-Objekten.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT * FROM timeintervaltransaction WHERE affiliated_work_time_account_id={} AND deleted=0 " \
                  "ORDER BY timeintervaltransaction_id".format(worktimeaccount_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (timeintervaltransaction_id, last_edit, affiliated_work_time_account_id, affiliated_time_interval_id,
             affiliated_break_id, affiliated_projectwork_id, deleted) in tuples:
            time_interval_transaction = tit.TimeIntervalTransaction()
            time_interval_transaction.set_id(timeintervaltransaction_id)
            time_interval_transaction.set_last_edit(last_edit)
            time_interval_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            time_interval_transaction.set_affiliated_time_interval(affiliated_time_interval_id)
            time_interval_transaction.set_affiliated_break(affiliated_break_id)
            time_interval_transaction.set_affiliated_projectwork(affiliated_projectwork_id)
            time_interval_transaction.set_deleted(deleted)
            result.append(time_interval_transaction)

        self._cnx.commit()

        cursor.close()

        return result

    def insert(self, time_interval_transaction):
        """Einfügen eines TimeIntervalTransaction-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param time_interval_transaction das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(timeintervaltransaction_id) AS maxid FROM timeintervaltransaction ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem TimeIntervalTransaction-Objekt zu."""
                time_interval_transaction.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                time_interval_transaction.set_id(1)

        command = "INSERT INTO timeintervaltransaction (timeintervaltransaction_id, last_edit, " \
                  "affiliated_work_time_account_id, affiliated_time_interval_id, affiliated_break_id," \
                  " affiliated_projectwork_id, deleted) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (time_interval_transaction.get_id(),
                time_interval_transaction.get_last_edit(),
                time_interval_transaction.get_affiliated_work_time_account(),
                time_interval_transaction.get_affiliated_time_interval(),
                time_interval_transaction.get_affiliated_break(),
                time_interval_transaction.get_affiliated_projectwork())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return time_interval_transaction

    def update(self, time_interval_transaction):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param time_interval_transaction das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE timeintervaltransaction " \
                  "SET  last_edit=%s, affiliated_work_time_account_id=%s, affiliated_time_interval_id=%s, " \
                  "affiliated_break_id=%s, affiliated_projectwork_id=%s, deleted=%s " \
                  "WHERE timeintervaltransaction_id=%s"
        data = (time_interval_transaction.get_last_edit(),
                time_interval_transaction.get_affiliated_work_time_account(),
                time_interval_transaction.get_affiliated_time_interval(),
                time_interval_transaction.get_affiliated_break(),
                time_interval_transaction.get_affiliated_projectwork(),
                time_interval_transaction.get_deleted(),
                time_interval_transaction.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, time_interval_transaction):
        """Setzen der deleted flag auf 1, sodass der Timeinterval Transaction Eintrag nicht mehr ausgegeben wird.

        :param time_interval_transaction das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "UPDATE timeintervaltransaction SET deleted=1 " \
                  "WHERE timeintervaltransaction_id={}".format(time_interval_transaction.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
