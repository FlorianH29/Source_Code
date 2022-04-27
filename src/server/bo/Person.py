from server.bo import BusinessObject as bo


class Person (bo.BusinessObject):
    """Realisierung einer exemplarischen Benutzerklasse.

    Aus Gründen der Vereinfachung besitzt der Kunden in diesem Demonstrator
    lediglich einen einfachen Namen, eine E_Mail-Adresse sowie eine außerhalb
    unseres Systems verwaltete Person ID (z.B. die Google ID).
    """
    def __init__(self):
        super().__init__()
        self.__name = ""  # Der Name des Benutzers.
        self.__email = ""  # Die E-Mail-Adresse des Benutzers.
        self.__person_id = ""  # Die extern verwaltete Person ID.


    def get_name(self):
        """Auslesen des Benutzernamens."""
        return self.__name

    def set_name(self, value):
        """Setzen des Benutzernamens."""
        self.__name = value

    def get_email(self):
        """Auslesen der E-Mail-Adresse."""
        return self.__email

    def set_email(self, value):
        """Setzen der E-Mail-Adresse."""
        self.__email = value

    def get_person_id(self):
        """Auslesen der externen User ID (z.B. Google ID)."""
        return self.__person_id

    def set_person_id(self, value):
        """Setzen der externen User ID (z.B. Google ID)."""
        self.__person_id = value

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Person: {}, {}, {}, {}".format(self.get_id(), self.__name, self.__email, self.__user_id)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        obj = Person()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_name(dictionary["name"])
        obj.set_email(dictionary["email"])
        obj.set_person_id(dictionary["person_id"])
        return obj
