export interface ILink {
    key: string;
    original: string;
    nLink: string
}

export class Link implements ILink{
    public isCreateDB: boolean = false;

    constructor(public key: string, public  original: string, public  nLink: string) {
        this.isCreateDB = false;
    }
}
