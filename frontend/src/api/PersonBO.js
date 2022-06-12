import BusinessObject from './BusinessObject';

//Stellt eine Person im System dar
export default class PersonBO extends BusinessObject {

  /**
   * Konstruktor, erstelt ein Personobjekt mit
   *
   * @param {String} aFirstname - der Vorname dieses PersonBO.
   * @param {String} aLastname - der Nachname dieses PersonBO.
   * @param {String} aUserName - der Benutzername dieses PersonBO.
   * @param {String} aMailAddress - die Mailadresse dieses PersonBO.
   * @param {String} aFireBaseId - die Firebase ID dieses PersonBO.
   */
  constructor(aFirstname, aLastname, aUserName, aMailAddress, aFireBaseId) {
    super();
    this.FirstName = aFirstname;
    this.lastname = aLastname;
    this.username = aUserName;
    this.mailaddress = aMailAddress;
    this.firebase_id = aFireBaseId;
  }

  /**
   * Setzt einen neuen Vornamen.
   *
   * @param {String} aFirstname - der neue Vorname dieses PersonBO.
   */
  setFirstName(aFirstname) {
    this.firstname = aFirstname;
  }

  /**
   * Gibt den Vornamen zurück.
   */
  getFirstName() {
    return this.firstname;
  }

  /**
   * Setzt einen neuen Nachnamen.
   *
   * @param {*} aLastname - der neue Nachname dieses PersonBO.
   */
  setLastName(aLastname) {
    this.lastname = aLastname;
  }

  /**
   * Gibt den Nachnamen zurück.
   */
  getLastName() {
    return this.lastname;
  }

  /**
   * Setzt einen neuen Username.
   *
   * @param {String} aUserName - der neue Username dieses PersonBO.
   */
  setUserName(aUserName) {
    this.username = aUserName;
  }

  /**
   * Gibt den Username zurück.
   */
  getUserName() {
    return this.username;
  }

  /**
   * Setzt eine neue Mailadresse.
   *
   * @param aMailAddress - die neue Mailadresse dieses PersonBO
   */
  setMailAddress(aMailAddress) {
    this.mailaddress = aMailAddress;
  }

  /**
   * Gibt die Mailadresse zurück.
   */
  getMailAddress() {
    return this.mailaddress;
  }

  /**
   * Setzt eine neue Firebase ID.
   *
   * @param aFireBaseId - die neue Firebase ID dieses PersonBO
   */
  setFireBaseId(aFireBaseId) {
    this.firebase_id = aFireBaseId;
  }

  /**
   * Gibt die Firebase ID zurück.
   */
  getFireBaseId() {
    return this.firebase_id;
  }

  /**
   * Gibt einen Array mit PersonBOs einer gegebenen JSON Struktur zurück.
   */
  static fromJSON(persons) {
    let result = [];

    if (Array.isArray(persons)) {
      persons.forEach((p) => {
        Object.setPrototypeOf(p, PersonBO.prototype);
        result.push(p);
      })
    } else {
      let p = persons;
      Object.setPrototypeOf(p, PersonBO.prototype);
      result.push(p);
    }
    //console.log(result)
    return result;
  }
}