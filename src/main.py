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


# hier könnt ihr eure Tests reinschreiben, bitte bevor ihr auf den Main-pushed löschen!!!

hwa = HdMWebAppAdministration()

#Test für Update-Befehl
ee1 = hwa.get_person_by_id(5)
ee1.set_lastname("Marko")

hwa.save_person(ee1)


#hwa.save_person(ee1)



#hwa.save_end_event(ee1)

# wa1 = hwa.get_work_time_account_by_id(2)
# print(wa1)

# end1 = hwa.create_end_event(1, '20220305', '20220908')
# print(end1)

'''if __name__ == '__main__':
    app.run(debug=True)'''

