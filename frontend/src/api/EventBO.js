import BusinessObject from './BusinessObject';

//Stellt ein Event im System dar
export default class EventBO extends BusinessObject {

  /**
   * Konstruktor, erstelt ein Eventobjekt mit
   *
   * @param {Number} anEventType - der Typ dieses EventBO.
   * @param {Date} aTimeStamp - die Kapazität dieses EventBO.
   */
  constructor(anEventType) {
    super();
    this.event_type = 1;
    this.time_stamp = 0;
  }

  /**
   * Setzt einen neuen Eventtyp.
   *
   * @param {Number} anEventType - der neue Typ dieses EventBO.
   */
  setEventType(anEventType) {
    this.event_type = anEventType;
  }

  /**
   * Gibt den Eventtyp zurück.
   */
  getEventType() {
    return this.event_type;
  }

  /**
   * Setzt den Zeitpunkt.
   *
   * @param {*} aTimeStamp - der neue Zeitpunkt dieses EventBO.
   */
  setTimeStamp(aTimeStamp) {
    this.time_stamp = aTimeStamp;
  }

  /**
   * Gibt den Zeitpunkt zurück.
   */
  getTimeStamp() {
    return this.time_stamp;
  }

  /**
   * Gibt einen Array mit EventBOs einer gegebenen JSON Struktur zurück.
   */
  static fromJSON(events) {
    let result = [];

    if (Array.isArray(events)) {
      events.forEach((e) => {
        Object.setPrototypeOf(e, EventBO.prototype);
        result.push(e);
      })
    } else {
      let e = events;
      Object.setPrototypeOf(e, EventBO.prototype);
      result.push(e);
    }
    //console.log(result)
    return result;
  }
}