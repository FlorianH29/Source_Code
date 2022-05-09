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
        cursor.execute("SELECT id, owner FROM worktimeaccounts") #tabelle worktimeaccount noch nicht existent
        tuples = cursor.fetchall()

        for (id, owner) in tuples:
            worktimeaccount = WorkTimeAccount()
            worktimeaccount. set_id(id)
            worktimeaccount.set_owner(owner)
            result.append(worktimeaccount)

        self._cnx.commit()
        cursor.close()

        return result

    """Hier wird das Konto eines Inhabers ausgelesen anhand des Fremdschlüssels.  """

    def find_by_owner_id(self, owner_id):
        result = []
        cursor = self._cnx.cursor()
        command =("SELECT id, owner FROM worktimeaccounts WHERE owner={} ORDER BY id".format(owner_id))
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

    """Hiermit kann ein Arbeitszeitkonto-Objekt in die Datenbank eingefügt werden.
    In zuge dessen wird auch der Primärachlüssel des zu übergebenden Objekts überprüft 
    und wenn erforerlich korrigiert."""
    #Hätte heir gerne ein Bsp wann der Primärschlüssel angepasst wird

    def insert(self, worktimeaccount):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM worktimeaccounts")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            worktimeaccount.set_id(maxid[0]+1)

        command = ("INSERT INTO worktimeaccounts (id, owner) VALUES (%s,%s)") #%s als Platzhalter und gibt einen formatierten string zurück
        newdata = (worktimeaccount.get_id(), worktimeaccount.get_owner())
        cursor.execute(command, newdata)

        self._cnx.commit()
        cursor.close()
        return worktimeaccount

    """Im Folgenden werden Objekte in die Datenbank aktualisiert also wiederholt rein geschrieben und eine alte Version 
     überschrieben."""
    def update(self, worktimeaccount):
        cursor = self._cnx.cursor()
        command = ("UPDATE worktimeaccounts" + "SET owner=%s WHERE is=%s")
        newdata = (worktimeaccount.get_owner(), worktimeaccount.get_id())
        cursor.execute(command, newdata)

        self._cnx.commit()
        cursor.close()

    """Löschen von Arbeitszeitkonto Daten aus der Datenbank."""
    def delete(self, worktimeaccount):
        cursor = self._cnx.cursor()
        command = ("DELETE FROM worktimeaccounts WHERE id={}".format(worktimeaccount.get_id()))
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()




