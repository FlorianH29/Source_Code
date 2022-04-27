from server.HdMWebAppAdministration import HdMWebAppAdministration
from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS

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
person1 = hwa.get_person_by_id(1)

print(person1)

if __name__ == '__main__':
    app.run(debug=True)
