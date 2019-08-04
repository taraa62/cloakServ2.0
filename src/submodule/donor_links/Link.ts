export interface ILink {
    key: string;
    original: string;
    action: string;
    isCreateDB: boolean;
    isRunToDonorRequest: boolean;
}


export class Link implements ILink {
    public isCreateDB: boolean = false;
    public isRunToDonorRequest: boolean;


    constructor(public key: string, public  original: string, public action: string) {
        this.isCreateDB = false;
    }
}
