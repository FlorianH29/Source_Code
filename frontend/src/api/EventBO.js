import BusinessObject from './BusinessObject';

//Stellt ein Event im System dar
export default class EventBO extends BusinessObject {

  /**
   * Konstruktor, erstelt ein Eventobjekt mit
   *
   * @param {Number} anEventType - der Typ dieses EventBO.
   * @param {Date} aTimeStamp - die Kapazität dieses EventBO.
   */
  constructor(anEventType, aTimeStamp) {
    super();
    this.eventType = anEventType;
    this.timeStamp = aTimeStamp;
  }

  /**
   * Setzt einen neuen Eventtyp.
   *
   * @param {Number} anEventType - der neue Typ dieses EventBO.
   */
  setEventType(anEventType) {
    this.eventType = anEventType;
  }

  /**
   * Gibt den Eventtyp zurück.
   */
  getEventType() {
    return this.eventType;
  }

  /**
   * Setzt den Zeitpunkt.
   *
   * @param {*} aTimeStamp - der neue Zeitpunkt dieses EventBO.
   */
  setTimeStamp(aTimeStamp) {
    this.timeStamp = aTimeStamp;
  }

  /**
   * Gibt den Zeitpunkt zurück.
   */
  getTimeStamp() {
    return this.timeStamp;
  }

  /**
   * Gibt einen Array mit EventBOs einer gegebenen JSON Struktur zurück.
   */
  static fromJSON(events) {
    let result = [];

    if (Array.isArray(events)) {
      events.forEach((a) => {
        Object.setPrototypeOf(a, EventBO.prototype);
        result.push(a);
      })
    } else {
      let a = events;
      Object.setPrototypeOf(a, EventBO.prototype);
      result.push(a);
    }
    //console.log(result)
    return result;
  }
}