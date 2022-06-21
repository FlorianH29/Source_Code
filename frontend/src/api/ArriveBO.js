import Event from './EventBO';

//Stellt ein Event im System dar
export default class ArriveBO extends Event {

  /**
   * Konstruktor, erstelt ein Arrive-objekt mit
   *
   * @param {Number} anEventType - der Typ dieses EventBO.
   */
  constructor(anEventType) {
    super();
  }


  static fromJSON(arrive) {
    let result = [];

    if (Array.isArray(arrive)) {
      arrive.forEach((a) => {
        Object.setPrototypeOf(a, ArriveBO.prototype);
        result.push(a);
      })
    } else {
      let a = arrive;
      Object.setPrototypeOf(a, ArriveBO.prototype);
      result.push(a);
    }
    //console.log(result)
    return result;
  }
}