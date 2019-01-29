import Plugins from '../../interfaces/plugin';
import { IANA } from '../../interfaces/ana';
import Package from '../package';
import { DiskData } from './model';
import * as path from 'path';
import * as fse from 'fs-extra';
const nunjucks = require('nunjucks');
const chalk = require('chalk');

export default class Treemap extends Plugins {
    ana: IANA;
    output: string;

    constructor(ana: IANA, output: string) {
        super(ana, 'treemap');
        this.output = path.resolve(process.cwd(), output);
    }

    async run() {
        const diskData: DiskData[] = [];
        const appPackage = this.ana.getPlugin('package') as Package;
        const main = new DiskData('主包', this.ana.mpDir);
        appPackage.mainPackage.forEach((file) => {
            main.value += file.stat.size;
            main.children.push(new DiskData(file.basename, file.path, file.stat.size));
        });
        diskData.push(main);
        Object.keys(appPackage.subPackages).forEach((subPackageName) => {
            const subPackage = new DiskData(
                appPackage.subPackages[subPackageName].root,
                this.ana.mpDir
            );
            appPackage.subPackages[subPackageName].files.forEach((file) => {
                subPackage.value += file.stat.size;
                subPackage.children.push(new DiskData(file.basename, file.path, file.stat.size));
            });
            diskData.push(subPackage);
        });
        const res = nunjucks.render(path.join(__dirname, 'tml.html'), {
            diskData: JSON.stringify(diskData)
        });
        console.log(chalk.green(`输出分析文件到${this.output}`));
        fse.outputFileSync(this.output, res);
    }
}
