import Plugins from '../../interfaces/plugin';
import { IANA, IPackage } from '../../interfaces/ana';
import Package from '../package';
import { DiskData } from './model';
import * as path from 'path';
import * as fse from 'fs-extra';
const nunjucks = require('nunjucks');
const chalk = require('chalk');

export default class Treemap extends Plugins {
    ana: IANA;
    output: string;
    diskData: DiskData[];

    constructor(ana: IANA, output: string) {
        super(ana, 'treemap');
        this.output = path.resolve(process.cwd(), output);
    }

    getPackageFileTree(p: IPackage): DiskData {
        const treeMap: { [name: string]: DiskData } = {};
        p.files.forEach((file) => {
            let pathname = file.path.replace(this.ana.mpDir, ''),
                dirname = file.dirname.replace(this.ana.mpDir, '');

            if (!treeMap[pathname]) {
                treeMap[pathname] = new DiskData(pathname, pathname, file.stat.size);
            }
            if (!treeMap[dirname]) {
                treeMap[dirname] = new DiskData(dirname, dirname);
            }
            treeMap[dirname].children.push(treeMap[pathname]);
            treeMap[dirname].value += treeMap[pathname].value;
        });
        const d = treeMap[p.path.replace(this.ana.mpDir, '')];
        d.name = p.name;
        return d;
    }

    async run() {
        this.diskData = [];
        const appPackage = this.ana.getPlugin('package') as Package;
        this.diskData.push(this.getPackageFileTree(appPackage.mainPackage));
        Object.keys(appPackage.subPackages).forEach((subPackageName) => {
            this.diskData.push(this.getPackageFileTree(appPackage.subPackages[subPackageName]));
        });
        const res = nunjucks.render(path.join(__dirname, '../../../tml.html'), {
            diskData: JSON.stringify(this.diskData)
        });
        console.log(chalk.green(`输出分析文件到${this.output}`));
        fse.outputFileSync(this.output, res);
    }
}
