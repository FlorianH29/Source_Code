from server.bo import EventTransaction as et
from server.db.Mapper import Mapper


class EventTransactionMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_by_key(self, key):
        """Suchen einer Event-Buchung mit vorgegebener Nummer. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return EventTransaction-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT  id, last_edit, affiliated_work_time_account_id, event FROM EventTransaction WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (id, last_edit, affiliated_work_time_account_id, event) = tuples[0]
            event_transaction = et.EventTransaction()
            event_transaction.set_id(id)
            event_transaction.set_last_edit(last_edit)
            event_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            event_transaction.set_event(event)

            result = event_transaction
        else:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Buchungen.

        :return Eine Sammlung mit Transaction-Objekten, die sämtliche Buchungen
                des Systems repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()

        cursor.execute("SELECT id, last_edit, affiliated_work_time_account_id, event from EventTransaction")
        tuples = cursor.fetchall()

        for (id, last_edit, affiliated_work_time_account_id, event) in tuples:
            event_transaction = et.EventTransaction()
            event_transaction.set_id(id)
            event_transaction.set_last_edit(last_edit)
            event_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            event_transaction.set_event(event)
            result.append(event_transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_worktimeaccount_id(self, worktimeaccount_id):
        """Auslesen aller Buchungen eines durch Fremdschlüssel (Kontonr.) gegebenen Ziel-Kontos.

        :param account_id Schlüssel des zugehörigen Kontos.
        :return Eine Sammlung mit Transaction-Objekten.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, last_edit, affiliated_work_time_account_id, event FROM EventTransaction WHERE affiliatedworktimeaccountid={} ORDER BY id".format(
            worktimeaccount_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, last_edit, affiliated_work_time_account_id, event) in tuples:
            event_transaction = et.EventTransaction()
            event_transaction.set_id(id)
            event_transaction.set_last_edit(last_edit)
            event_transaction.set_affiliated_work_time_account(affiliated_work_time_account_id)
            event_transaction.set_event(event)
            result.append(event_transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, event_transaction):
        """Einfügen eines Transaction-Objekts in die Datenbank.

        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param transaction das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM EventTransaction ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            event_transaction.set_id(maxid[0] + 1)

        command = "INSERT INTO EventTransaction (id, last_edit, affiliated_work_time_account_id, event) VALUES (%s,%s,%s,%s)"
        data = (event_transaction.get_id(),
                event_transaction.get_last_edit(),
                event_transaction.get_affiliated_work_time_account(),
                event_transaction.get_event())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return event_transaction

    def update(self, event_transaction):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param transaction das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE EventTransaction " + "SET id=%s, last_edit=%s, affiliated_work_time_account_id=%s, event=%s WHERE id=%s"
        data = (event_transaction.get_id(),
                event_transaction.get_last_edit(),
                event_transaction.get_affiliated_work_time_account(),
                event_transaction.get_event())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, event_transaction):
        """Löschen der Daten eines Transaction-Objekts aus der Datenbank.

        :param transaction das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM EventTransaction WHERE id={}".format(event_transaction.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with EventTransactionMapper() as mapper:
        result = mapper.find_all()
        for t in result:
            print(t)
