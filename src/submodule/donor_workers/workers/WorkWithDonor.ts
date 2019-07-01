import {BasePoolWorker} from "../../../module/workers/pool/workers/BasePoolWorker";

export class WorkWithDonor extends BasePoolWorker {

    protected resetWorker(data: any): void {
        setTimeout(() => {
            this.sendMessage("end", data)
        }, 5000);
    }
}

new WorkWithDonor();


