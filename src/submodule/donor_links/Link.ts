export class Link {
    public isCreateDB: boolean = false;

    constructor(public key: string, public  original: string, public  nLink: string) {
        this.isCreateDB = false;
    }
}
