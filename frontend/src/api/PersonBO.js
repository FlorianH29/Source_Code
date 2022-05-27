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
    this.firstname = aFirstname;
    this.lastname = aLastname;
    this.username = aUserName;
    this.mailaddress = aMailAddress;
    this.firebase_id = aFireBaseId;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param {String} aFirstname - the new firstname of this CustomerBO.
   */
  setFirstName(aFirstname) {
    this.firstname = aFirstname;
  }

  /**
   * Gets the firstname.
   */
  getFirstName() {
    return this.firstname;
  }

  /**
   * Sets a new lastname.
   *
   * @param {*} aLastname - the new lastname of this CustomerBO.
   */
  setLastName(aLastname) {
    this.lastname = aLastname;
  }

  /**
   * Gets the lastname.
   */
  getLastName() {
    return this.lastname;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param {String} aUserName - the new username of this CustomerBO.
   */
  setUserName(aUserName) {
    this.username = aUserName;
  }

  /**
   * Gets the firstname.
   */
  getUserName() {
    return this.username;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param aMailAddress
   */
  setMailAddress(aMailAddress) {
    this.mailaddress = aMailAddress;
  }

  /**
   * Gets the firstname.
   */
  getMailAddress() {
    return this.mailaddress;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param aFireBaseId
   */
  setFireBaseId(aFireBaseId) {
    this.firebase_id = aFireBaseId;
  }

  /**
   * Gets the firstname.
   */
  getFireBaseId() {
    return this.firebase_id;
  }

  /**
   * Returns an Array of PersonBOs from a given JSON structure.
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
    //console.log(result)
    return result;
  }
}