import BusinessObject from './BusinessObject';

export default class WorktimeAccountBO extends BusinessObject {

      /**
   * Konstruktor, erstelt ein Arbeitszeitkontoobjekt mit
   *
   * @param {Number} aOwner - die Id des Besitzers des Arbeitszeitkontos.
   */

  constructor(aOwner) {
    super();
    this.owner = aOwner;
    }

  /**
   * Setzt einen neuen Owner.
   *
   * @param aOwner
   */
  setOwner(aOwner) {
    this.owner = aOwner;
  }

  /**
   *gibt den Owner zurück.
   */
  getOwner() {
    return this.owner;
  }

  static fromJSON(worktimeaccount) {
        let result = [];

        if (Array.isArray(worktimeaccount)) {
            worktimeaccount.forEach((w) => {
                Object.setPrototypeOf(w, WorktimeAccountBO.prototype);
                result.push(w);
            })
        } else {
            // Es handelt sich offenbar um ein singuläres Objekt
            let w = worktimeaccount;
            Object.setPrototypeOf(w, WorktimeAccountBO.prototype);
            result.push(w);
        }
        //console.log(result)
        return result;
    }
}