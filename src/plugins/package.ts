import Plugins from '../interfaces/plugin';
import { IANA } from '../interfaces/ana';
import File = require('vinyl');

const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
type FileMap = { [name: string]: { root: string; files: File[] } };
type APPPackage = {
    root: string;
    pages: string[];
};
type AppFile = {
    pages: string[];
    subPackages: APPPackage[];
};
export default class Package extends Plugins {
    appFilePath: string;
    appFile: AppFile;
    subPackages: FileMap;
    mainPackage: File[];

    constructor(ana: IANA) {
        super(ana, 'package');
        this.appFilePath = path.resolve(process.cwd(), ana.appFilePath);
        try {
            this.appFile = fse.readJsonSync(this.appFilePath);
        } catch (e) {
            console.log(chalk.red('找不到 app.json'));
        }
        this.subPackages = {};
    }

    async run() {
        const filePaths = Object.keys(this.ana.fileMap);
        let mainPackageFilePaths = filePaths;
        this.appFile.subPackages.forEach((item) => {
            const packageDir = path.resolve(this.ana.mpDir, item.root);
            this.subPackages[packageDir] = { root: item.root, files: [] };
            mainPackageFilePaths = mainPackageFilePaths.filter((filePath) => {
                if (filePath.indexOf(packageDir) === 0) {
                    // 这里不从page取，因为属于子包文件夹下面的都是子包内容
                    this.subPackages[packageDir].files.push(this.ana.fileMap[filePath]);
                    return false;
                }
                return true;
            });
        });
        this.mainPackage = mainPackageFilePaths.map((item) => this.ana.fileMap[item]);
    }
}
