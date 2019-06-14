import {ServerHTTP} from "./server/ServerHTTP";
import {ServerConfig} from "./server/ServerConfig";

import {config} from "./server/config";
import {ServerHTTP2} from "./server/ServerHTTP2";

(process as any).constant = {
    NODE_ENV: (process.argv.indexOf("--dev") === -1) ? "production" : "test",
    conf: new ServerConfig(config),
    app: null,
};
// (process as any).constant.app = new ServerHTTP();
(process as any).constant.app = new ServerHTTP2();


