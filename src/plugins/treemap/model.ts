import { IDiskData } from './interface';
export class DiskData implements IDiskData {
    children: IDiskData[];
    name: string;
    path: string;
    value: number;

    constructor(name = '', path = '', value = 0, children = []) {
        this.name = name;
        this.path = path;
        this.value = value;
        this.children = children;
    }
}
