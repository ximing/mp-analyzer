import Plugins from '../interfaces/plugin';
import { IANA, IPackage } from '../interfaces/ana';

const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
type FileMap = { [name: string]: IPackage };
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
    mainPackage: IPackage;

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
        // 排序，路径长的放在最前面，方便后续遍历
        mainPackageFilePaths.sort((a, b) => b.split('/').length - a.split('/').length);
        this.appFile.subPackages.forEach((item) => {
            const packageDir = path.resolve(this.ana.mpDir, item.root);
            this.subPackages[packageDir] = { name: item.root, path: packageDir, files: [] };
            mainPackageFilePaths = mainPackageFilePaths.filter((filePath) => {
                if (filePath.indexOf(packageDir) === 0) {
                    // 这里不从page取，因为属于子包文件夹下面的都是子包内容
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
