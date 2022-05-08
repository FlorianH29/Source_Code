from server.bo.WorkTimeAccount import WorkTimeAccount
from server.db.Mapper import Mapper

"""Erklärung"""
class WorkTimeAccountMapper (Mapper):

    def __init__(self):
        super().__init__()

    """Hier werden alle Arbeitszeitkonten ausgelesen."""
    def find_all(self):

        result = []
        cursor = self._cnx.cursor() #cursor erlaubt uns SQL befehle hier auszuführen (siehe Verb. Mapper Klasse)
        cursor.execute("SELECT id, owner FROM worktimeaccount") #tabelle worktimeaccount noch nicht existent
        tuples = cursor.fetchall()

        for (id, owner) in tuples:
            worktimeaccount = WorkTimeAccount()
            worktimeaccount. set_id(id)
            worktimeaccount.set_owner(owner)
            result.append(worktimeaccount)

        self._cnx.commit()
        cursor.close()

        return result

    """Hier wird das Konto eines Inhabers ausgelesen anhand des Fremdschlüssels. 
        (-> Noch nicht im Klassendiagramm aber auf jedenfall sinnvoll)
    
    def find_by_owner_id(self, owner_id):
        result = []
        cursor = self._cnx.cursor()
        command =("SELECT id, owner FROM worktimeaccount WHERE owner={} ORDER BY id".format(owner_id))
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, owner) in tuples:
            worktimeaccount = WorkTimeAccount()
            worktimeaccount.set_id(id)
            worktimeaccount.set_owner(owner)
            result.append(worktimeaccount)

        self._cnx.commit()
        cursor.close()

        return result

    """

    """Hiermit kann ein Arbeitszeitkonto-Objekt in die Datenbank eingefügt werden."""