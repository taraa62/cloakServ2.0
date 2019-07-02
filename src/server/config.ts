export const config = {
    mode: "dev",
    contentTypes: require("../const/content-type"),
    server: {
        type: "http",   //"http" | "http2"
        port: 8082,
        x_powered_by: "mask",
        listDisableRoute: ["/", "/favicon.ico"],
        corsWhitelist: ["http://localhost:4200", "http://localhost:8080", "*"],
    },
    adminConnection: {
        room: "cloaker",
        type: "test",
        name: "cloker_parent",
    },
    logger: {
        // must be the two element
        path: "./dist/module/logger/LoggerModule",
        config: {
            isUseLocal: true,
            local: "./winston",
            levels: ["debug", "info", "error"],
            LOG_FOLDER: "./LOGS",

            remote: {
                isUse: false,
                type: "socket",  // type:redis|post|socket
                host: "localhost",
                port: 8083,
                auth: "t62:taraa62",
                channel: "TEST66",
                package: "Test66",
                pool: 3,
                redis: {
                    host: "127.0.0.1",
                    port: 6379,
                },
            },
        },
    },
    initModuleBeforeRunServe: [
        {
            isUse: true,
            name: "mongodb",
            path: "./dist/module/db/mongo/MongoDBModule",
            config: {
                debug: false,
                url: "mongodb://localhost:27017/cloaker2",
                isCheckDockerContainer: true,
                dockContainerName: "mongodb"
            },
        }, {
            isUse: true,
            name: "workers",
            path: "./dist/module/workers/WorkersModule",
            config: {},
        }, {
            isUse: true,
            name: "route",
            path: "./dist/module/route/RouteModule",
            config: {},
        },

    ],
    initModuleAfterRunServe: [{
        isUse: true,
        name: "donor",
        path: "./dist/submodule/DonorModule",
        config: {
            CONFIGS: {
                pathToConfFiles: "./libs/configs/site/",
                dbTable: "configs",
                isUpdateConfWithFile: true,
                isClearAllConfigsDB: true
            },
            ITEM: {
                baseConfig: "./libs/configs/base.config.json",
                nginxConfig: "./libs/configs/nginx.config.json"
            },
            WORKER_DONOR: {
                name: "donorWorker",
                jsFile: "./workers/WorkWithDonor.js"
            }
        },
    }],
};
