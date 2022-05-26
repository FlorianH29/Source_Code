from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS

from server.HdMWebAppAdministration import HdMWebAppAdministration
from server.bo.Person import Person
import datetime



app = Flask(__name__)

CORS(app, resources=r'/hdmwebapp/*')

api = Api(app, version='1.0', title='HdMWebAppAPI',
          description='Eine rudimentäre Demo-API für das Buchen von Zeitslots für Projekte.')

hdmwebapp = api.namespace('hdmwebapp', description='Funktionen der HdMWebApp zur Zeitbuchung.')

# BusinessObject dient als Basisklasse, auf der die weiteren Strukturen Customer, Account und Transaction aufsetzen.
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'),
    'last_edit': fields.DateTime(attribute='_last_edit', description='Der Zeitpunkt der letzten Änderung')
})

person = api.inherit('Person', bo, {
    'firstname': fields.String(attribute='__firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='__lasttname', description='Nachname eines Benutzers'),
    'mailaddress': fields.String(attribute='__mailaddress', description='E-Mail-Adresse eines Benutzers'),
    'username': fields.String(attribute='__username', description='Username eines Benutzers'),
    'firebase_id': fields.String(attribute='__firebase_id', description='Google User ID eines Benutzers')
})

project = api.inherit('Project', bo, {
    'projectname': fields.String(attribute='__project_name', description='Name eines Projekts'),
    'client': fields.String(attribute='__client', description='Auftraggeber eines Projekts'),
    'project_term_id': fields.String(attribute='__project_term_id', description='Laufzeit eines Projekts')
})

worktimeaccount = api.inherit('WorkTimeAccount', bo, {
    'owner': fields.String(attribute='__owner', description='Besitzer eines Arbeitszeitkonto')
})

timeinterval = api.inherit('TimeInterval', bo, {
    'starttime': fields.String(attribute='__start_time', description='Startzeitpunkt eines Zeitintervalls'),
    'endtime': fields.String(attribute='__end_time', description='Endzeitpunkt eines Zeitintervalls'),
    'timeperiod': fields.String(attribute='__time_period', description='Zeitraum des Intervalls')
})

work_time_account = api.inherit('WorkTimeAccount', bo, {
    'owner': fields.Integer(attribute='__owner', description='Unique Id des Kontoinhabers')
})

@hdmwebapp.route('/persons')
@hdmwebapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonListOperations(Resource):
    @hdmwebapp.marshal_list_with(person)
    #@secured
    def get(self):
        """Auslesen aller Customer-Objekte.

        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        hwa = HdMWebAppAdministration()
        persons = hwa.get_all_persons()
        return persons

    @hdmwebapp.marshal_with(person, code=200)
    @hdmwebapp.expect(person)  # Wir erwarten ein Customer-Objekt von Client-Seite.

    def post(self):
        """Anlegen eines neuen Customer-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der BankAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        hwa = HdMWebAppAdministration()

        proposal = Person.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Customer-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            p = hwa.create_person(proposal.get_first_name(), proposal.get_last_name())
            return p, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
#@property
    #def payload(self):
        """Store the input payload in the current request context"""
        #return request.get_json()


# hier könnt ihr eure Tests reinschreiben, bitte bevor ihr auf den Main-pushed löschen!!!

hwa = HdMWebAppAdministration()

#Test für Update-Befehl
"""hwa.create_person(1,'20220505', 'Hans', 'Wurst', 'h.wurst', 'hw@gmx.lol', 1)
ee1 = hwa.get_person_by_id(2)

wa1 = hwa.get_work_time_account_by_id(4)
ti1 = hwa.get_time_interval_by_id(1)

p1 = hwa.get_project_by_id(1)

hwa.create_activity_for_project('Test Activity', 10, p1)"""

#Test worktimeaccount für person und transaktion auf das Konto
# -> anlegen Funktioniert, verbindung timeinterval und timeinterval transaction noch nicht
#hwa.create_work_time_account_for_person(hwa.get_person_by_id(3))



if __name__ == '__main__':
    app.run(debug=False)

