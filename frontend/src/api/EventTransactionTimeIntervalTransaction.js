import BusinessObject from './BusinessObject';

export default class EventTransactionTimeIntervalTransaction extends BusinessObject {


    constructor() {
    super();

    }

      static fromJSON(eventsandintervals) {
        let result = [];

        if (Array.isArray(eventsandintervals)) {
            eventsandintervals.forEach((w) => {
                //Object.setPrototypeOf(w, WorktimeAccountBO.prototype);
                result.push(w);
            })
        } else {
            // Es handelt sich offenbar um ein singuläres Objekt
            let w = eventsandintervals;
            //Object.setPrototypeOf(w, WorktimeAccountBO.prototype);
            result.push(w);
        }
        console.log(result)
        return result;
    }
}