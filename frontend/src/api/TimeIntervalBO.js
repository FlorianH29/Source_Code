import BusinessObject from './BusinessObject';

//Stellt ein Zeitintervall im System dar
export default class TimeIntervalBO extends BusinessObject {

  /**
   * Konstruktor, erstellt ein Zeitintervall Objekt mit
   *
   * @param {Date} aStartEvent - das Startevent des Zeitintervalls.
   * @param {Date} anEndEvent - das Endevent des Zeitintervalls
   * @param {Number} aTimePeriod - der gespeicherte Zeitraum des Zeitintervalls.
   */
  constructor(aStartEvent, anEndEvent, aTimePeriod) {
    super();
    this.start_event = aStartEvent;
    this.end_event = anEndEvent;
    this.time_period = aTimePeriod;

  }

  /**
   * Setzt ein neues Startereignis.
   *
   * @param {Date} aStartEvent - das neue Startereignis dieses TimeIntervalBO.
   */
  setStartEvent(aStartEvent) {
    this.start_event = aStartEvent;
  }

  /**
   * Gibt das Startereignis zurück.
   */
  getStartEvent() {
    return this.start_event;
  }

  /**
   * Setzt ein neues Endereignis.
   *
   * @param {Date} anEndEvent - das neue Endereignis dieses TimeIntervalBO.
   */
  setEndEvent(anEndEvent) {
    this.end_event = anEndEvent;
  }

  /**
   * Gibt das Endereignis zurück.
   *
   */
  getEndEvent() {
    return this.end_event;
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
