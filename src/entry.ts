import {ServerConfig} from "./server/ServerConfig";

import {config} from "./server/config";
import {ServerHTTP2} from "./server/ServerHTTP2";
import {ServerHTTP} from "./server/ServerHTTP";


const conf: ServerConfig = new ServerConfig(config);
let NODE_ENV = "test";

if (process.argv.indexOf("--dev") > -1 || (process.argv.indexOf("--prod") > -1)) {
    NODE_ENV = (process.argv.indexOf("--dev") > -1) ? "test" : "production";
} else {
    NODE_ENV = (conf.config.mode === "test") ? "test" : "production";
}

conf.NODE_ENV = NODE_ENV;


(process as any).constant = {
    NODE_ENV: NODE_ENV,
    conf: conf,
    app: null,
};

(process as any).constant.app = (conf.config.server.type === "http2") ? new ServerHTTP2() : new ServerHTTP();




