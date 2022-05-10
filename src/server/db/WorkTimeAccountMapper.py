from server.bo import WorkTimeAccount as wta
from server.db.Mapper import Mapper

"""Erklärung"""
class WorkTimeAccountMapper (Mapper):

    def __init__(self):
        super().__init__()

    """Hier werden alle Arbeitszeitkonten ausgelesen."""
    def find_all(self):

        result = []
        cursor = self._cnx.cursor() #cursor erlaubt uns SQL befehle hier auszuführen (siehe Verb. Mapper Klasse)
        cursor.execute("SELECT id, last_edit, user_id FROM Worktimeaccount")
        tuples = cursor.fetchall()

        for (id, last_edit, owner) in tuples:
            work_time_account = wta.WorkTimeAccount()
            work_time_account.set_id(id)
            work_time_account.set_last_edit(last_edit)
            work_time_account.set_owner(owner)
            result.append(work_time_account)

        self._cnx.commit()
        cursor.close()

        return result

    """Hier wird das Konto eines Inhabers ausgelesen anhand des Fremdschlüssels.  """

    def find_by_owner_id(self, owner_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, last_edit, user_id FROM Worktimeaccount WHERE user_id={} ORDER BY id".format(owner_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, last_edit,  owner) in tuples:
            work_time_account = wta.WorkTimeAccount()
            work_time_account.set_id(id)
            work_time_account.set_last_edit(last_edit)
            work_time_account.set_owner(owner)
            result.append(work_time_account)

        self._cnx.commit()
        cursor.close()

        return result

    """Find by Key"""
    def find_by_key(self, key):
        """Suchen einer EventTransaction mit vorgegebener Nummer. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return EventTransaction-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT  id, last_edit, user_id FROM Worktimeaccount WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (id, last_edit, user_id) = tuples[0]
            work_time_account = wta.WorkTimeAccount()
            work_time_account.set_id(id)
            work_time_account.set_last_edit(last_edit)
            work_time_account.set_owner(user_id)

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
        cursor.execute("SELECT MAX(id) AS maxid FROM Worktimeaccount")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] in tuples is not None:  # Die Liste beinhaltet min. ein Projekt -> die Id ist somit n+1
                work_time_account.set_id(maxid[0] + 1)
            else:  # Die Liste ist leer, somit wird dem neuen Projekt die Id "1" zugewiesen
                work_time_account.set_id(1)

        command = "INSERT INTO Worktimeaccount (id, last_edit, user_id) VALUES (%s,%s,%s)" #%s als Platzhalter und gibt einen formatierten string zurück
        data = (work_time_account.get_id(), work_time_account.get_last_edit(), work_time_account.get_owner())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return work_time_account

    """Im Folgenden werden Objekte in die Datenbank aktualisiert also wiederholt rein geschrieben und eine alte Version 
     überschrieben."""
    def update(self, work_time_account):
        cursor = self._cnx.cursor()
        command = "UPDATE Worktimeaccount" + "SET user_id=%s, last_edit=%s, user_id=%s WHERE id=%s"
        data = (work_time_account.get_owner(), work_time_account.get_last_edit(), work_time_account.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    """Löschen von Arbeitszeitkonto Daten aus der Datenbank."""
    def delete(self, work_time_account):
        cursor = self._cnx.cursor()
        command = "DELETE FROM Worktimeaccount WHERE id={}".format(work_time_account.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

if (__name__ == "__main__"):
    with WorkTimeAccountMapper() as mapper:
        result = mapper.find_all()
        for t in result:
            print(t)


