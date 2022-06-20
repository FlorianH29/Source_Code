import BusinessObject from './BusinessObject';

//Stellt ein Zeitintervall im System dar
export default class TimeIntervalBO extends BusinessObject {

  /**
   * Konstruktor, erstellt ein Zeitintervall Objekt mit
   *
   * @param {Number} aStartEventId - die Id des Startevents des Zeitintervalls.
   * @param {Number} anEndEventId - die Id des Endevents des Zeitintervalls
   * @param {Number} aTimePeriod - der gespeicherte Zeitraum des Zeitintervalls.
   */
  constructor() {
    super();
    this.start_event_id = 0;
    this.end_event_id = 0;
    this.time_period = 0;
  }

  /**
   * Setzt ein neues Startereignis.
   *
   * @param {Number} aStartEventId - die neue Id des neuen Startereignisses dieses TimeIntervalBOs.
   */
  setStartEvent(aStartEventId) {
    this.start_event_id = aStartEventId;
  }

  /**
   * Gibt die Id des Startereignisses zurück.
   */
  getStartEventId() {
    return this.start_event_id;
  }

  /**
   * Setzt eine neue Id eines neuen Endereignisses.
   *
   * @param {Number} anEndEventId - die neue Id des neuen Endereignisses dieses TimeIntervalBOs.
   */
  setEndEvent(anEndEventId) {
    this.end_event_id = anEndEventId;
  }

  /**
   * Gibt die Id des Endereignisses zurück.
   *
   */
  getEndEventId() {
    return this.end_event_id;
  }

  /**
   * Setzt einen neuen Zeitraum.
   *
   * @param {Number} aTimePeriod - die neue TimePeriod dieses TimeIntervallBO.
   */
  setTimePeriod(aTimePeriod) {
    this.time_period = aTimePeriod;
  }

  /**
   * Gibt den Zeitraum zurück.
   */
  getTimeIPeriod() {
    return this.time_period;
  }

  /**
   * Gibt ein Array von ProjectBOs zurück.
   */
  static fromJSON(timeintervals) {
    let result = []

    if (Array.isArray(timeintervals)) {
      timeintervals.forEach((p) => {
        Object.setPrototypeOf(p, TimeIntervalBO.prototype);
        result.push(p);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let p = timeintervals;
      Object.setPrototypeOf(p, TimeIntervalBO.prototype);
      result.push(p);
    }

    //console.log(result)
    return result;
  }
}
