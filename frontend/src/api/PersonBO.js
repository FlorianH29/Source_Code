import BusinessObject from './BusinessObject';

//Stellt eine Person im System dar
export default class PersonBO extends BusinessObject {

  /**
   * Konstruktor, erstelt ein Person Objekt mit
   *
   * @param {String} aFirstname - der Vorname dieses PersonBO.
   * @param {String} aLastname - der Nachname dieses PersonBO.
   * @param {String} aUserName - der Benutzername dieses PersonBO.
   * @param {String} aMailAddress - die Mailadresse dieses PersonBO.
   * @param {String} aFireBaseId - die Firebase ID dieses PersonBO.
   */
  constructor(aFirstname, aLastname, aUserName, aMailAddress, aFireBaseId) {
    super();
    this.first_name = aFirstname;
    this.last_name = aLastname;
    this.user_name = aUserName;
    this.mail_address = aMailAddress;
    this.firebase_id = aFireBaseId;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param {String} aFirstname - the new firstname of this CustomerBO.
   */
  setFirstName(aFirstname) {
    this.first_name = aFirstname;
  }

  /**
   * Gets the firstname.
   */
  getFirstName() {
    return this.first_name;
  }

  /**
   * Sets a new lastname.
   *
   * @param {*} aLastname - the new lastname of this CustomerBO.
   */
  setLastName(aLastname) {
    this.last_name = aLastname;
  }

  /**
   * Gets the lastname.
   */
  getLastName() {
    return this.last_name;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param {String} aFirstname - the new firstname of this CustomerBO.
   */
  setUserName(aUserName) {
    this.user_name = aUserName;
  }

  /**
   * Gets the firstname.
   */
  getUserName() {
    return this.user_name;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param aMailAddress
   */
  setMailAddress(aMailAddress) {
    this.mail_address = aMailAddress;
  }

  /**
   * Gets the firstname.
   */
  getMailAddress() {
    return this.mail_address;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param aFireBaseId
   */
  setFireBaseId(aFireBaseId) {
    this.first_name = aFireBaseId;
  }

  /**
   * Gets the firstname.
   */
  getFireBaseId() {
    return this.firebase_id;
  }

  /**
   * Returns an Array of CustomerBOs from a given JSON structure.
   */
  static fromJSON(persons) {
    let result = [];

    if (Array.isArray(persons)) {
      persons.forEach((p) => {
        Object.setPrototypeOf(p, PersonBO.prototype);
        result.push(p);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let p = persons;
      Object.setPrototypeOf(p, PersonBO.prototype);
      result.push(p);
    }

    return result;
  }
}