import fs from "node:fs";
import RConfig from "./model/index.js";
if (!global.segment) {
    global.segment = (await import("oicq")).segment
}

const versionData = RConfig.getConfig("version");

logger.info(`R插件${versionData[0].version}初始化`);

const files = fs.readdirSync("./plugins/rconsole-plugin/apps").filter(file => file.endsWith(".js"));

let ret = [];

files.forEach(file => {
    ret.push(import(`./apps/${file}`));
});

ret = await Promise.allSettled(ret);

let apps = {};
for (let i in files) {
    let name = files[i].replace(".js", "");

    if (ret[i].status !== "fulfilled") {
        logger.error(`载入插件错误：${logger.red(name)}`);
        logger.error(ret[i].reason);
        continue;
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
}
export { apps };
