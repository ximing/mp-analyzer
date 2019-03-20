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
        const filePaths = Object.keys(this.ana.fileMap);
        let mainPackageFilePaths = filePaths;
        mainPackageFilePaths.sort((a, b) => b.split('/').length - a.split('/').length);
        this.appFile.subPackages.forEach((item) => {
            const packageDir = path.resolve(this.ana.mpDir, item.root);
            this.subPackages[packageDir] = { name: item.root, path: packageDir, files: [] };
            mainPackageFilePaths = mainPackageFilePaths.filter((filePath) => {
                if (filePath.indexOf(packageDir) === 0) {
                    this.subPackages[packageDir].files.push(this.ana.fileMap[filePath]);
                    return false;
                }
                return true;
            });
        });
        console.log(mainPackageFilePaths);
        this.mainPackage = {
            name: '主包',
            path: this.ana.mpDir,
            files: mainPackageFilePaths.map((item) => this.ana.fileMap[item])
        };
    }
}
exports.default = Package;
