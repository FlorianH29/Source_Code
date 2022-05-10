from server.HdMWebAppAdministration import HdMWebAppAdministration
from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS
import datetime

app = Flask(__name__)

api = Api(app, version='1.0', title='HdMWebAppAPI',
    description='Eine rudimentäre Demo-API für das Buchen von Zeitslots für Projekte.')

# BusinessObject dient als Basisklasse, auf der die weiteren Strukturen Customer, Account und Transaction aufsetzen.
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'),
})

person = api.inherit('Person', bo, {
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lasttname', description='Nachname eines Benutzers'),
    'mailaddress': fields.String(attribute='_mailaddress', description='E-Mail-Adresse eines Benutzers'),
    'username': fields.String(attribute='_username', description='Username eines Benutzers'),
    'user_id': fields.String(attribute='_user_id', description='Google User ID eines Benutzers')
})

hwa = HdMWebAppAdministration()
# person1 = hwa.get_person_by_id(1)

# event1 = hwa.get_all_start_events()
# event3 = hwa.get_start_event_by_id(1)
# hwa.delete_start(event3) # nochmal checken warum versucht wird versucht wird 2 mal zu deleten, dann kommt Fehler dass
                           # Id nicht mehr da weil schon gelöscht
#test = hwa.get_time_interval_transaction_by_id(1)
#hwa.create_event_transaction(2, '20220101', 4, 5) #nochmal checken, wieso es doppelt angelegt wird
#test2 = hwa.get_event_transaction_by_id(2)
#hwa.create_work_time_account(1,'20220510',1)
#test2 = hwa.get_work_time_account_by_id(8)
#print(test2)


#hwa.create_activity(1, '20220202', 'TestAktivität', 10, 1)

# Test und Ausgabe eines Projekts (mit der ID 0)
#project_one = hwa.get_project_by_id(0)
#print(project_one)

# Test und Ausgabe eines ProjektWorks (mit der ID 0)
#project_work_one = hwa.get_projectwork_by_id(0)
#print(project_work_one)

if __name__ == '__main__':
    app.run(debug=True)
