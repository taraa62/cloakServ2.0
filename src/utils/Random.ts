export class Random {

    private static readonly symb: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    public static randomString(lenght: number = 7): string {
        let text = '';


        for (let i = 0; i < lenght; i++)
            text += Random.symb.charAt(Math.floor(Math.random() * Random.symb.length));

        return text;
    }
}
