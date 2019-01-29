import { IANA } from './ana';
export default abstract class Plugin {
    ana: IANA;
    name: string;

    constructor(ana: IANA, name: string) {
        this.ana = ana;
        this.name = name;
    }

    abstract run(): Promise<any | void>;
}
