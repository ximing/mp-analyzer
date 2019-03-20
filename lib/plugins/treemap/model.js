"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiskData {
    constructor(name = '', path = '', value = 0, children = []) {
        this.name = name;
        this.path = path;
        this.value = value;
        this.children = children;
    }
}
exports.DiskData = DiskData;
