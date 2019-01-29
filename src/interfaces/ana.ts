import File = require('vinyl');
import Package from '../plugins/package';
import Plugin from '../interfaces/plugin';

interface FileMap {
    [name: string]: File;
}

interface IANA {
    appFilePath: string;
    mpDir: string;
    package: Package;
    fileMap: FileMap;
    getPlugin(name: string): Plugin;
    register(p: Plugin);
    run(): Promise<any | void>;
}

interface PluginMap {
    [name: string]: Plugin;
}

export { FileMap, IANA, PluginMap };
