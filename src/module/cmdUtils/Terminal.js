const AnsiTerminal = require('node-ansiterminal').AnsiTerminal;
const AnsiParser = require('node-ansiparser');



// const terminal = new AnsiTerminal(80, 25, 500);
const an = "\u001b[90m┌──────────┬────┬─────────┬─────────┬─────┬─────────┬─────────┬────────┬─────┬────────┬───────────────┬──────────┐\u001b[39m\\n\u001b[90m│\u001b[39m\u001b[1m\u001b[36m App name \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m id \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m version \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m mode    \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m pid \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m status  \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m restart \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m uptime \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m cpu \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m mem    \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m user          \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\u001b[1m\u001b[36m watching \u001b[39m\u001b[22m\u001b[90m│\u001b[39m\\n\u001b[90m├──────────┼────┼─────────┼─────────┼─────┼─────────┼─────────┼────────┼─────┼────────┼───────────────┼──────────┤\u001b[39m\\n\u001b[90m│\u001b[39m\u001b[1m\u001b[36m \u001b[1m\u001b[36mgcp\u001b[36m\u001b[1m      \u001b[39m\u001b[22m\u001b[90m│\u001b[39m 0  \u001b[90m│\u001b[39m 1.0.0   \u001b[90m│\u001b[39m \u001b[94m\u001b[1mcluster\u001b[22m\u001b[39m \u001b[90m│\u001b[39m 0   \u001b[90m│\u001b[39m \u001b[31m\u001b[1mstopped\u001b[22m\u001b[39m \u001b[90m│\u001b[39m 0       \u001b[90m│\u001b[39m 0      \u001b[90m│\u001b[39m 0%  \u001b[90m│\u001b[39m 0 B    \u001b[90m│\u001b[39m \u001b[1mАдминистратор\u001b[22m \u001b[90m│\u001b[39m \u001b[90mdisabled\u001b[39m \u001b[90m│\u001b[39m\\n\u001b[90m└──────────┴────┴─────────┴─────────┴─────┴─────────┴─────────┴────────┴─────┴────────┴───────────────┴──────────┘\u001b[39m\\n"
const as = "[90m┌──────────┬────┬─────────┬─────────┬─────┬─────────┬─────────┬────────┬─────┬────────┬───────────────┬──────────┐[39m\n" +
    "[90m│[39m[1m[36m App name [39m[22m[90m│[39m[1m[36m id [39m[22m[90m│[39m[1m[36m version [39m[22m[90m│[39m[1m[36m mode    [39m[22m[90m│[39m[1m[36m pid [39m[22m[90m│[39m[1m[36m status  [39m[22m[90m│[39m[1m[36m restart [39m[22m[90m│[39m[1m[36m uptime [39m[22m[90m│[39m[1m[36m cpu [39m[22m[90m│[39m[1m[36m mem    [39m[22m[90m│[39m[1m[36m user          [39m[22m[90m│[39m[1m[36m watching [39m[22m[90m│[39m\n" +
    "[90m├──────────┼────┼─────────┼─────────┼─────┼─────────┼─────────┼────────┼─────┼────────┼───────────────┼──────────┤[39m\n" +
    "[90m│[39m[1m[36m [1m[36mgcp[36m[1m      [39m[22m[90m│[39m 0  [90m│[39m 1.0.0   [90m│[39m [94m[1mcluster[22m[39m [90m│[39m 0   [90m│[39m [31m[1mstopped[22m[39m [90m│[39m 0       [90m│[39m 0      [90m│[39m 0%  [90m│[39m 0 B    [90m│[39m [1mАдминистратор[22m [90m│[39m [90mdisabled[39m [90m│[39m\n" +
    "[90m└──────────┴────┴─────────┴─────────┴─────┴─────────┴─────────┴────────┴─────┴────────┴───────────────┴──────────┘[39m\n";


class Terminal {

    constructor(parent){
        this.parent = parent;
        this.parent.server.EE.addListener("initTerminal", this.createNewTerminal);

       /* let tt = ""
        const terminal = {
            inst_p: function (s) {
                tt += s;
                // console.log('print', s);
            },
            // inst_o: function(s) {console.log('osc', s);},
            // inst_x: function(flag) {console.log('execute', flag.charCodeAt(0));},
            // inst_c: function(collected, params, flag) {console.log('csi', collected, params, flag);},
            // inst_e: function(collected, flag) {console.log('esc', collected, flag);},
            // inst_H: function(collected, params, flag) {console.log('dcs-Hook', collected, params, flag);},
            // inst_P: function(dcs) {console.log('dcs-Put', dcs);},
            // inst_U: function() {console.log('dcs-Unhook');}
        };*/
        // const aa = as.replaceAll("\n", "\\n")
        // const parser = new AnsiParser(terminal);
        // parser.parse(aa)
        // console.log(tt)
        // console.log(parser.parse(an))
    }

    createNewTerminal(conf) {
        if (conf.s && conf.j && conf.j.command) {
            try {

                let resText = ""
                const terminal = {
                    inst_p: function (s) {
                        resText += s;
                        //     console.log(s)
                    },
                };
                const parser = new AnsiParser(terminal);

                const term = cmd.run(conf.j.cmdCommand);
                term.stdout.on('data', async (data) => {
                    try {
                        data = data.replaceAll("\n", "\\n")
                        resText = "";
                        await parser.parse(data);
                        // console.log(resText);
                        const resp = {
                            returnID: conf.j.returnID,
                            msg: resText
                        }
                        conf.s.emit(conf.j.__send, JSON.stringify(resp));
                    } catch (e) {
                        conf.s.emit(conf.j.__send, JSON.stringify({msg: "error"}));
                        conf.s.close();
                    }

                });
                term.stderr.on('data', async (data) => {
                    try {
                        data = data.replaceAll("\n", "\\n")
                        resText = "";
                        await parser.parse(data);
                        const resp = {
                            returnID: conf.j.returnID,
                            msg: resText
                        }
                        conf.s.emit(conf.j.__send, JSON.stringify(convert.toHtml(resp.msg)));
                    } catch (e) {
                        conf.s.emit(conf.j.__send, JSON.stringify({msg: "error"}));
                        conf.s.close();
                    }
                });

                term.on('exit', async (code) => {
                    try {
                        //    code = code.replaceAll("\n", "\\n");
                        resText = "";
                        await parser.parse(code);
                        const resp = {
                            returnID: conf.j.returnID,
                            msg: "exit with code => " + code
                        }
                        conf.s.emit(conf.j.__send, JSON.stringify(resp));
                    } catch (e) {
                        conf.s.emit(conf.j.__send, JSON.parse({msg: "error"}));
                        conf.s.close();
                    }


                });
                conf.s.terminal = term;

            } catch (e) {
                this.logger.error(e.message);
            }

        }
    }

}

module.exports = Terminal;
