export class StringUtils {
    public static replaceAll (target:string, search: string, replacement: string) {
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    public static hashCode (target:string):number {
        let hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < target.length; i++) {
            chr = target.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
}


