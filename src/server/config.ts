export const config = {
    nameApp: "cloaker server",
    version: "1.1",
    mode: "dev",
    path: "./ServerHTTP",
    room: "cloaker",
    type: "test",
    name: "cloker_parent",
    contentTypes: require("../const/content-type"),
    server: {
        port: 8082,
        x_powered_by: "mask",
        listDisableRoute: ["/", "/favicon.ico"],
        corsWhitelist: ["http://localhost:4200", "http://localhost:8080", "*"],
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
            name: "workers",
            path: "./dist/module/workers/WorkersModule",
            config: {},
        },{
            isUse: true,
            name: "route",
            path: "./dist/module/route/RouteModule",
            config: {},
        },

    ],
    initModuleAfterRunServe: [{
        isUse:false,
        name: "",
        path: "",
        config: {},
    }],
};
