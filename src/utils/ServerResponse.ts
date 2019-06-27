/*
    проверка на то, был или нет отправлен ответ клиенту, можно добавить логер.
 */

const ServerResponse = require("express/lib/response");

ServerResponse.isSend = function () {
    return this._header;
}

if (!ServerResponse.protoSend) ServerResponse.protoSend = ServerResponse.send;
if (!ServerResponse.protoRedirect) ServerResponse.protoRedirect = ServerResponse.redirect;

ServerResponse.send = function (data: any) {
    if (!this.isSend()) {
        this.protoSend(data);
    }
}
ServerResponse.redirect = function (code: number, link: string) {
    if (!this.isSend()) {
        this.protoRedirect(code, link);
    }
}

