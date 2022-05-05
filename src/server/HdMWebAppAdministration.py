from .bo.Person import Person
from .db.PersonMapper import PersonMapper
from .db.TimeIntervalTransactionMapper import TransactionMapper

class HdMWebAppAdministration(object):

    def __init__(self):
        pass

    def get_person_by_id(self, number):
        """Den Benutzer mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_key(number)

    def get_transaction_by_id(self, number):
        """Die Buchung mit der gegebenen Buchungs-ID auslesen."""
        with TransactionMapper() as mapper:
            return mapper.find_by_key(number)
