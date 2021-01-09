const path = require('path');
const fs = require('fs');
const glob = require('glob');
const Vinyl = require('vinyl');
import { FileMap, IANA, PluginMap } from './interfaces/ana';
import Plugin from './interfaces/plugin';
import TreeMap from './plugins/treemap/treemap';
import Package from './plugins/package';

export default class ANA implements IANA {
    appFilePath: string;
    mpDir: string;
    output: string;
    package: Package;
    fileMap: FileMap;
    plugins: Plugin[];
    pluginMap: PluginMap;

    // @params mpDir 小程序路径
    constructor(mpDir: string, output?: string) {
        this.mpDir = path.resolve(process.cwd(), mpDir);
        this.appFilePath = path.join(this.mpDir, 'app.json');
        this.fileMap = {};
        this.plugins = [];
        this.pluginMap = {};
        this.initPlugins();
        this.output = output || path.join(process.cwd(), 'treemap.html');
    }

    initPlugins() {
        this.register(new Package(this));
        this.register(new TreeMap(this, this.output));
    }

    getPlugin(name): Plugin {
        return this.pluginMap[name];
    }

    register(p: Plugin) {
        if (this.pluginMap[p.name]) {
            throw new Error(`插件${p.name}已存在`);
        }
        this.pluginMap[p.name] = p;
        this.plugins.push(p);
    }

    scanFiles(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            glob(`${this.mpDir}/**/*`, (err, files) => {
                if (err) {
                    return reject(err);
                }
                files.forEach((filePath) => {
                    const stat = fs.statSync(filePath);
                    this.fileMap[filePath] = new Vinyl({
                        cwd: process.cwd(),
                        base: path.parse(filePath).dir,
                        path: filePath,
                        stat,
                        contents: stat.isDirectory()
                            ? Buffer.from('')
                            : Buffer.from(
                                  fs.readFileSync(filePath, {
                                      encoding: 'utf8'
                                  })
                              )
                    });
                });
                resolve(files);
            });
        });
    }

    async run() {
        await this.scanFiles();
        for (let i = 0; i < this.plugins.length; i++) {
            await this.plugins[i].run();
        }
    }
}
