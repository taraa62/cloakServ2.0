import {BWorker} from "./BWorker";
import {IncomingMessage} from "http";

export class WorkerActions extends BWorker {

    public getAction(req: IncomingMessage): string {

        let url = req.url;
        if (url.length < 1) url = "/";

        if (url.endsWith("?")) {
            url = url.substr(0, url.length - 1);
        }
        if (url.endsWith("/")) {
            url += "index.html";
        }

        if (url.startsWith("/")) url = url.substr(1, url.length);


        url = url.toLocaleLowerCase();


        console.log('dewdw');

return ""
    }


}
