from server.bo import BusinessObject as bo

"""Erstellen eines Zeitkontos, auf dem ein Mitarbeiter seine Arbeitszeiten 
(in Form von Zeitintervallen) abspecihern und einsehen kann."""

""" DieKlasse WorkTimeAccount (Arbeitszeitkonto) erbt von BusinessObject."""


class WorkTimeAccount(bo.BusinessObject):
    """Ein WorkTimeAccount hat immer einen Inhaber (Person) und kann beliebig viele Transactions 
    (Zeitintervallbuchungen) haben. Zu dem Owner die immer eine Person ist muss eine Fremdschlüsselbeziehung 
    hergestellt werden damit der Ih´nhaber klar definiert ist."""

    def __init__(self):
        super().__init__()
        self._owner = None

    """Getter (= auslesen) und Setter (= setzen) für die Fremdschlüsselbeziehung."""

    def get_owner(self):
        return self._owner

    def set_owner(self, person):
        self._owner = person

    """Textuelle Beschreibung des Arbeitszeitkontos - wird benötigt für den Fall, dass eine andere Klasse auf das 
    Arbeitszeitkonto zugreift und einen Print Befehl ausführt."""

    def __str__(self):
        return "WorkTimeAccount: {}, owned by {}".format(self.get_id(), self._owner)

    """Bis jetzt haben wir nur eine Kombination von Schlüssel-Wert-Paaren. Mit Hilfe der Schlüssel 
    können wir auf die Werte innerhalb des Dictionaries zugreifen. Jetzt wollen wir aber das Dictionarie
    in unseren WorkTimeAccount umwandeln. Dazu benutzen wir die staticmethod da sie an die Klasse 
    und nicht an ihr Objekt gebunden ist also nicht vom Zustand des Objekts abhängig ist."""

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = WorkTimeAccount()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_owner(dictionary["owner"])
        return obj
