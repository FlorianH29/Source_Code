from server.bo import BusinessObject as bo


class Person(bo.BusinessObject):
    """Realisierung der Personenklasse.

    Eine Person besitzt einen Vor- und Nachname sowie einen Benutzernamen. Des Weiteren
    hat eine Person eine E-Mail-Adresse und eine ID, welche in diesem Fall von Firebase
    verwaltet wird.
    """

    def __init__(self):
        super().__init__()
        self._firstname = ""  # Der Vorname des Benutzers.
        self._lastname = ""  # Der Nachname des Benutzers.
        self._username = ""  # Der Username des Benutzers.
        self._mailaddress = ""  # Die E-Mail-Adresse des Benutzers.
        self._firebase_id = ""  # Die extern verwaltete Person ID.

    def get_firstname(self):
        """Auslesen des Vornamens."""
        return self._firstname

    def get_lastname(self):
        """Auslesen des Nachnamens."""
        return self._lastname

    def get_username(self):
        """Auslesen des Benutzernamens."""
        return self._username

    def set_firstname(self, firstname):
        """Setzen des Vornamens."""
        self._firstname = firstname

    def set_lastname(self, lastname):
        """Setzen des Nachnamens."""
        self._lastname = lastname

    def set_username(self, username):
        """Setzen des Benutzernamens."""
        self._username = username

    def get_mailaddress(self):
        """Auslesen der E-Mail-Adresse."""
        return self._mailaddress

    def set_mailaddress(self, mailaddress):
        """Setzen der E-Mail-Adresse."""
        self._mailaddress = mailaddress

    def get_firebase_id(self):
        """Auslesen der externen User ID (z.B. Google ID)."""
        return self._firebase_id

    def set_firebase_id(self, firebase_id):
        """Setzen der externen User ID (z.B. Google ID per Firebase)."""
        self._firebase_id = firebase_id

    def __str__(self):
        """Erzeugen einer textuellen Darstellung der jeweiligen Instanz."""
        return "Person: {}, {}, {}, {}, {}, {}, {}".format(self.get_id(), self.get_last_edit(), self._firstname,
                                                           self._lastname, self._username, self._mailaddress,
                                                           self._firebase_id)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine Person()."""
        obj = Person()
        obj.set_id(dictionary["id"])
        obj.set_last_edit(dictionary["last_edit"])
        obj.set_firstname(dictionary["firstname"])
        obj.set_lastname(dictionary["lastname"])
        obj.set_username(dictionary["username"])
        obj.set_mailaddress(dictionary["mailaddress"])
        obj.set_firebase_id(dictionary["firebase_id"])
        obj.set_deleted(dictionary['deleted'])
        return obj


