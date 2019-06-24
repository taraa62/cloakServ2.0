class DefCheckerDocker {
    constructor(parent) {
        this.parent = parent;
        this.isDocker = true;

        // this.checkRunnableDocker();
    }

    checkRunnableDocker() {
        this.parent.runCommand("docker -v", ({error, data, exitCode}) => {
            if (data && data.indexOf("Docker version") > -1) {
                this.isDocker = true;
            }
        });
    }

    checkRunDockContainer(name, callBack = null) {
        if (this.isDocker)
            this.parent.runCommandFullResult("docker start " + name, (data) => {
                if (callBack) callBack.call(null, data);
            });
        else if (callBack) callBack.call(null, null);
    }

    async checkRunDockContainerSync(name) {
        if (this.isDocker)
            return this.parent.runCommandFullResult("docker start " + name);
        else return null;
    }

}

module.exports = DefCheckerDocker;
