export interface ILink {
    key: string;
    original: string;
    nLink: string
    isCreateDB: boolean;
    isRedirect: boolean;
}


export class Link implements ILink {
    public isCreateDB: boolean = false;


    constructor(public key: string, public  original: string, public  nLink: string, public isRedirect: boolean = false) {
        this.isCreateDB = false;
    }
}
