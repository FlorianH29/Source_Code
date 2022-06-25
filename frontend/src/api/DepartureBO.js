import Event from './EventBO';

//Stellt ein Event im System dar
export default class DepartureBO extends Event {

  /**
   * Konstruktor, erstelt ein Departure-objekt mit
   *
   * @param {Number} anEventType - der Typ dieses EventBO.
   */
  constructor(anEventType) {
    super();
  }


  static fromJSON(departure) {
    let result = [];

    if (Array.isArray(departure)) {
      departure.forEach((d) => {
        Object.setPrototypeOf(d, DepartureBO.prototype);
        result.push(d);
      })
    } else {
      let d = departure;
      Object.setPrototypeOf(d, DepartureBO.prototype);
      result.push(d);
    }
    //console.log(result)
    return result;
  }
}