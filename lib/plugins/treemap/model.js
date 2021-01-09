"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiskData = void 0;
class DiskData {
    constructor(name = '', path = '', value = 0, children = []) {
        this.name = name;
        this.path = path;
        this.value = value;
        this.children = children;
    }
}
exports.DiskData = DiskData;
