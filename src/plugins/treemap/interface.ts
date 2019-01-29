export interface IDiskData {
    name: string;
    value: number;
    path: string;
    children?: IDiskData[];
}
