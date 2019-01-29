"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
class Package {
    constructor(appFilePath) {
        this.appFilePath = path.resolve(process.cwd(), appFilePath);
        try {
            this.appFile = fse.readJsonSync(this.appFilePath);
        }
        catch (e) {
            console.log(chalk.red('找不到 app.json'));
        }
        this.subPackages = {};
    }
    async analyse() {
        this.appFile.subPackages.forEach((item) => {
            const packageDir = path.resolve(process.cwd(), item.root);
            this.subPackages[packageDir] = [];
            item.pages.forEach((page) => {
                this.subPackages[packageDir].push(path.parse(path.resolve(process.cwd(), page)).dir);
            });
        });
    }
}
exports.default = Package;
