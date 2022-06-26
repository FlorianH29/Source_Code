import BusinessObject from './BusinessObject';

export default class EventTransactionTimeIntervalTransaction extends BusinessObject {

    constructor() {
        super();
    }

    static fromJSON(eventsAndIntervals) {
        let result = [];

        if (Array.isArray(eventsAndIntervals)) {
            eventsAndIntervals.forEach((w) => { // vlt dem w noch nen besseren Namen geben?
                result.push(w);
            })
        } else {
            let w = eventsAndIntervals;
            result.push(w);
        }
        console.log(result)
        return result;
    }
}