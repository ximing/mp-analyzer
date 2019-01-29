"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("../interfaces/plugin");
const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
class Package extends plugin_1.default {
    constructor(ana) {
        super(ana, 'package');
        this.appFilePath = path.resolve(process.cwd(), ana.appFilePath);
        try {
            this.appFile = fse.readJsonSync(this.appFilePath);
        }
        catch (e) {
            console.log(chalk.red('找不到 app.json'));
        }
        this.subPackages = {};
    }
    async run() {
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
