import BusinessObject from './BusinessObject';

/**
 * Represents an account object of a customer.
 */
export default class WorktimeaccountBO extends BusinessObject {

  /**
   * Constructs a new AccountBO object with a given owner.
   *
   * @param {*} aOwner - the owner of this AccountBO.
   */
  constructor(aOwner) {
    super();
    this.owner = aOwner;
  }

  /**
   * Sets the owner of this AccountBO.
   *
   * @param {*} aOwner - the new owner of this AccountBO.
   */
  setOwner(aOwner) {
    this.owner = aOwner;
  }

  /**
   * Gets the owner of this AccountBO.
   */
  getOwner() {
    return this.owner;
  }

  /**
   * Returns an Array of AccountBOs from a given JSON structure
   */
  static fromJSON(worktimeaccounts) {
    let result = [];

    if (Array.isArray(worktimeaccounts)) {
      worktimeaccounts.forEach((a) => {
        Object.setPrototypeOf(a, WorktimeaccountBO.prototype);
        result.push(a);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let a = worktimeaccounts;
      Object.setPrototypeOf(a, WorktimeaccountBO.prototype);
      result.push(a);
    }

    return result;
  }
}