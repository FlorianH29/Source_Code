from server.bo import WorkTimeAccount as wta
from server.db.Mapper import Mapper


class WorkTimeAccountMapper(Mapper):

    def __init__(self):
        super().__init__()

    """Hier werden alle Arbeitszeitkonten ausgelesen."""

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()  # cursor erlaubt uns SQL befehle hier auszuführen (siehe Verb. Mapper Klasse)
        cursor.execute("SELECT * FROM worktimeaccount WHERE deleted=0")
        tuples = cursor.fetchall()

        for (work_time_account_id, last_edit, owner, deleted) in tuples:
            work_time_account = wta.WorkTimeAccount()
            work_time_account.set_id(work_time_account_id)
            work_time_account.set_last_edit(last_edit)
            work_time_account.set_owner(owner)
            work_time_account.set_deleted(deleted)
            result.append(work_time_account)

        self._cnx.commit()
        cursor.close()

        return result

    """Hier wird das Konto eines Inhabers ausgelesen anhand des Fremdschlüssels.  """

    def find_by_owner_id(self, owner_id):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * FROM worktimeaccount WHERE person_id={} AND deleted=0 " \
                  "ORDER BY worktimeaccount_id".format(owner_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (work_time_account_id, last_edit, person_id, deleted) = tuples[0]
            work_time_account = wta.WorkTimeAccount()
            work_time_account.set_id(work_time_account_id)
            work_time_account.set_last_edit(last_edit)
            work_time_account.set_owner(person_id)
            work_time_account.set_deleted(deleted)

            result = work_time_account
        else:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen eines Worktime Accounts mit vorgegebener Nummer. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return Worktimeaccount-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM worktimeaccount WHERE worktimeaccount_id={} AND deleted=0".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (work_time_account_id, last_edit, person_id, deleted) = tuples[0]
            work_time_account = wta.WorkTimeAccount()
            work_time_account.set_id(work_time_account_id)
            work_time_account.set_last_edit(last_edit)
            work_time_account.set_owner(person_id)
            work_time_account.set_deleted(deleted)

            result = work_time_account
        else:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    """Hiermit kann ein Arbeitszeitkonto-Objekt in die Datenbank eingefügt werden.
    In zuge dessen wird auch der Primärachlüssel des zu übergebenden Objekts überprüft 
    und wenn erforerlich korrigiert."""

    def insert(self, work_time_account):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(worktimeaccount_id) AS maxid FROM worktimeaccount")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem WorkTimeAccount-Objekt zu."""
                work_time_account.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                work_time_account.set_id(1)

        command = "INSERT INTO worktimeaccount (worktimeaccount_id, last_edit, person_id, deleted) VALUES (%s,%s,%s,%s)"
        # %s als Platzhalter und gibt einen formatierten string zurück
        data = (work_time_account.get_id(), work_time_account.get_last_edit(), work_time_account.get_owner(),
                work_time_account.get_deleted())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return work_time_account

    """Im Folgenden werden Objekte in die Datenbank aktualisiert also wiederholt rein geschrieben und eine alte Version 
     überschrieben."""

    def update(self, work_time_account):
        cursor = self._cnx.cursor()
        command = "UPDATE worktimeaccount SET last_edit=%s, worktimeaccount_id=%s WHERE worktimeaccount_id=%s"
        data = (work_time_account.get_last_edit(), work_time_account.get_id(), work_time_account.get_owner())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    """Setzen der deleted flag auf 1, sodass der Worktime Account Eintrag nicht mehr ausgegeben wird."""

    def delete(self, work_time_account):
        cursor = self._cnx.cursor()
        command = "UPDATE worktimeaccount SET deleted=1 WHERE worktimeaccount_id={}".format(work_time_account.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


