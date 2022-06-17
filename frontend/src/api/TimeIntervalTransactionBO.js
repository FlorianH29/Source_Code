import BusinessObject from './BusinessObject';

//Stellt eine TimeIntervalTransaction im System dar
export default class TimeIntervalTransactionBO extends BusinessObject {

    /**
     * Konstruktor, erstelt ein Projektarbeitsobjekt mit
     *
     * @param {Number} anAffiliatedTimeInterval - die Id des Startevents des Zeitintervalls.
     * @param {Number} anAffiliatedBreak - die Id des Endevents des Zeitintervalls
     * @param {Number} anAffiliatedProjectWork - die Aktivität, die diesem ProjectWorkBO zugeordnet ist.
     */
    constructor(anAffiliatedTimeInterval, anAffiliatedBreak, anAffiliatedProjectWork) {
        super();
        this.affiliated_time_interval = anAffiliatedTimeInterval;
        this.affiliated_break = anAffiliatedBreak;
        this.affiliated_projectwork = anAffiliatedProjectWork;
    }

    /**
     * Setzt ein neues zugeordnetes TimeInterval .
     *
     * @param {Number} anAffiliatedTimeInterval - das neue zugeordnete TimeInterval dieser TimeIntervalTransaction.
     */
    setAffiliatedTimeInterval(anAffiliatedTimeInterval) {
        this.affiliated_time_interval = anAffiliatedTimeInterval;
    }

    /**
     * Gibt das zugeordnete TimeInterval zurück.
     */
    getAffiliatedTimeInterval() {
        return this.affiliated_time_interval;
    }

    /**
     * Setzt eine neue zugeordnete Pause .
     *
     * @param {Number} anAffiliatedBreak - die neue zugeordnete Pause dieser TimeIntervalTransaction.
     */
    setAffiliatedBreak(anAffiliatedBreak) {
        this.affiliated_break = anAffiliatedBreak;
    }

    /**
     * Gibt die zugeordnete Pause zurück.
     */
    getAffiliatedBreak() {
        return this.affiliated_break;
    }

    /**
     * Setzt eine neue zugeordnete ProjectWork .
     *
     * @param {Number} anAffiliatedProjectWork - die neue zugeordnete Projectarbeit dieser TimeIntervalTransaction.
     */
    setAffiliatedProjectWork(anAffiliatedProjectWork) {
        this.affiliated_projectwork = anAffiliatedProjectWork;
    }

    /**
     * Gibt die zugeordnete ProjectWork zurück.
     */
    getAffiliatedProjectWork() {
        return this.affiliated_projectwork;
    }

    /**
     * Gibt einen Array mit TimeIntervalTrasnactionBOs einer gegebenen JSON Struktur zurück.
     */
    static fromJSON(timeIntervalTransactions) {
        let result = [];

        if (Array.isArray(timeIntervalTransactions)) {
            timeIntervalTransactions.forEach((tit) => {
                Object.setPrototypeOf(tit, TimeIntervalTransactionBO.prototype);
                result.push(tit);
            })
        } else {
            let tit = timeIntervalTransactions;
            Object.setPrototypeOf(tit, TimeIntervalTransactionBO.prototype);
            result.push(tit);
        }
        console.log(result)
        return result;
    }

}