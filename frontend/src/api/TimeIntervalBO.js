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
  constructor(aStartEventId, anEndEventId, aTimePeriod) {
    super();
    this.start_event_id = aStartEventId;
    this.end_event_id = anEndEventId;
    this.time_period = aTimePeriod;

  }

  /**
   * Setzt ein neues Startereignis.
   *
   * @param {Number} aStartEventId - das neue Startereignis dieses TimeIntervalBO.
   */
  setStartEvent(aStartEventId) {
    this.start_event_id = aStartEventId;
  }

  /**
   * Gibt das Startereignis zurück.
   */
  getStartEventId() {
    return this.start_event_id;
  }

  /**
   * Setzt ein neues Endereignis.
   *
   * @param {Number} anEndEventId - das neue Endereignis dieses TimeIntervalBO.
   */
  setEndEvent(anEndEventId) {
    this.end_event_id = anEndEventId;
  }

  /**
   * Gibt das Endereignis zurück.
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
