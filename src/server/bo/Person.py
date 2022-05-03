from server.bo import BusinessObject as bo


class Person(bo.BusinessObject):
    """Realisierung der Personenklasse.

    Eine Person besitzt einen Vor- und Nachname sowie einen Benutzernamen. Des Weiteren
    hat eine Person eine E-Mail-Adresse und eine ID, welche in diesem Fall von Firebase
    verwaltet wird.
    """

    def __init__(self):
        super().__init__()
        self.__firstname = ""  # Der Vorname des Benutzers.
        self.__lastname = ""  # Der Nachname des Benutzers.
        self.__username = ""  # Der Username des Benutzers.
        self.__mailaddress = ""  # Die E-Mail-Adresse des Benutzers.
        self.__person_id = ""  # Die extern verwaltete Person ID.

    def get_firstname(self):
        """Auslesen des Vornamens."""
        return self.__firstname

    def get_lastname(self):
        """Auslesen des Nachnamens."""
        return self.__lastname

    def get_username(self):
        """Auslesen des Benutzernamens."""
        return self.__username

    def set_firstname(self, value):
        """Setzen des Vornamens."""
        self.__firstname = value

    def set_lastname(self, value):
        """Setzen des Nachnamens."""
        self.__lastname = value

    def set_username(self, value):
        """Setzen des Benutzernamens."""
        self.__username = value

    def get_mailaddress(self):
        """Auslesen der E-Mail-Adresse."""
        return self.__mailaddress

    def set_mailaddress(self, value):
        """Setzen der E-Mail-Adresse."""
        self.__mailaddress = value

    def get_person_id(self):
        """Auslesen der externen User ID (z.B. Google ID)."""
        return self.__person_id

    def set_person_id(self, value):
        """Setzen der externen User ID (z.B. Google ID per Firebase)."""
        self.__person_id = value

    def __str__(self):
        """Erzeugen einer textuellen Darstellung der jeweiligen Instanz."""
        return "Person: {}, {}, {}, {},{},{}".format(self.get_id(), self.__firstname, self.__lastname, self.__username,
                                                     self.__mailaddress, self.__person_id)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        obj = Person()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_firstname(dictionary["firstname"])
        obj.set_lastname(dictionary["lastname"])
        obj.set_username(dictionary["username"])
        obj.set_mailaddress(dictionary["mailaddress"])
        obj.set_person_id(dictionary["person_id"])
        return obj
