import BusinessObject from './BusinessObject';

export default class WorktimeAccountBO extends BusinessObject {

    constructor() {
        super();
    }

    static fromJSON(worktimeaccount) {
        let result = [];

        if (Array.isArray(worktimeaccount)) {
            worktimeaccount.forEach((w) => {
                Object.setPrototypeOf(w, WorktimeAccountBO.prototype);
                result.push(w);
            })
        } else {
            // Es handelt sich offenbar um ein singuläres Objekt
            let w = worktimeaccount;
            Object.setPrototypeOf(w, WorktimeAccountBO.prototype);
            result.push(w);
        }

        //console.log(result)
        return result;
    }
}