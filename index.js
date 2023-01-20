const fs = require("fs");
const YAML = require('yaml');
const jsYaml = require('js-yaml');
const Handlebars = require("handlebars");
const glob = require("glob");
const globPromise = require("glob-promise");

const fromRepo = process.argv[2];
const toRepo = process.argv[3];
console.log(`from : ${fromRepo}`);
console.log(`to: ${toRepo}`);
console.log(`node program started in: ${process.cwd()}`);
const regexComponent = /\".*\.Component\"/g;
const cloud = {
    "public": true,
    "service": toRepo
};
const packageJSON = JSON.parse(fs.readFileSync(`${fromRepo}/package.json`).toString('utf8'));
const templates = ["mta.yaml", "ui5-deploy-cf.yaml", "xs-app.json", "xs-security.json"];
const scripts = [
    { name: "build:cf", command: "ui5 build preload --clean-dest --config ui5-deploy-cf.yaml --include-task=generateManifestBundle generateCachebusterInfo" },
    { name: "deploy:abap", command: "ui5 build preload --clean-dest --config ui5-deploy-abap.yaml --include-task=generateManifestBundle generateCachebusterInfo && rimraf archive.zip" },
    { name: "build:mta", command: "rimraf resources mta_archives && mbt build --mtar archive" },
    { name: "undeploy", command: `cf undeploy ${toRepo} --delete-services --delete-service-keys` }];
const devDependencies = [
    { name: "@sap/ux-ui5-tooling", version: "1" },
    { name: "@ui5/cli", version: "^2.11.0" },
    { name: "@ui5/fs", version: "^2.0.6" },
    { name: "@ui5/logger", version: "^2.0.1" },
    { name: "rimraf", version: "3.0.2" },
    { name: "@sap/ui5-builder-webide-extension", version: "1.0.x" },
    { name: "ui5-task-zipper", version: "^0.3.1" },
    { name: "ui5-task-transpile", version: "^0.3.1" },
    { name: "mbt", version: "^1.0.15" }
];
const ui5Dependencies = [
    "@sap/ux-ui5-tooling",
    "@sap/ui5-builder-webide-extension",
    "ui5-task-zipper",
    "ui5-task-transpile",
    "mbt"];
// functions for reading component + manifest
const getSourceFolderPath = () => fromRepo + (fs.existsSync(fromRepo + "/webapp") ? "/webapp/" : "/WebContent/");

// const getComponentPath = () => `${getSourceFolderPath()}Component.js`;
const getComponentPath = async () => ((await globPromise(fromRepo+'/!(node_modules)/Component.js'))[0]) || false;

// const getManifestPath = () => `${getSourceFolderPath()}manifest.json`;
const getManifestPath = async () => ((await globPromise(fromRepo+'/**/manifest.json'))[0]);
const getComponentFile = async () => fs.readFileSync((await getComponentPath()), 'utf8');
const getManifest = async () => JSON.parse(fs.readFileSync( (await getManifestPath()), 'utf8').toString('utf8'));
const setManifest = (manifestJSON) => fs.writeFileSync(`${getSourceFolderPath()}manifest.json`, JSON.stringify(manifestJSON, null, '\t'));
// const manifest = getManifest();
const getComponentId = async () => (await getComponentFile()).match(regexComponent);
// get namespace 
const getNameSpace = async () => {
    const compPath = await getComponentPath();
    console.log(compPath);
    const manifestPath = await getManifestPath();
    console.log(manifestPath);
    let compid = "";
    if(compPath){
        compid = await getComponentId();
        compid = compid && Array.isArray(compid) && compid[0].substring(1, compid[0].indexOf(".Component"));
    }else{
        const manifest = await getManifest();
        compid = manifest["sap.app"].id;
    }
    return compid;
};
const getAppInfo = async () => ({ ID: (await getNameSpace()).split('.').join(''), appname: (await getNameSpace()).split('.').join('-'), namesepace: (await getNameSpace()), reponame: toRepo });
getAppInfo().then(appInfo => console.log(appInfo));
// functions for processing templates
const getTemplateFiles = () => templates.map(filename => ({ name: filename, template: Handlebars.compile(fs.readFileSync(`templates/${filename}`).toString('utf8')) }));
const compileTemplateFiles = async () => {
    const appinfo = await getAppInfo();
    return getTemplateFiles().map((file) => ({ compiledContent: file.template(appinfo), ...file }));
};
const processTemplateFiles = async () => (await compileTemplateFiles()).forEach(file => fs.writeFileSync(`${fromRepo}/${file.name}`, file.compiledContent));
// functions for processing templates
const initScript = () => packageJSON.scripts || (packageJSON.scripts = { });
const addScriptToPackage = (script) => packageJSON.scripts[script.name] = script.command;
const addScriptsToPackage = () => scripts.forEach(script => addScriptToPackage(script));
//always use this version
const addDevDependency = (dependency) => (packageJSON.devDependencies[dependency.name] = dependency.version);
// const addDevDependency = (dependency) => packageJSON.devDependencies[dependency.name] || (packageJSON.devDependencies[dependency.name] = dependency.version);
const addDevDependencies = () => devDependencies.forEach(devDependency => addDevDependency(devDependency));
const initUI5Depencies = () => (packageJSON.ui5 && packageJSON.ui5.dependencies) || (packageJSON.ui5 = { "dependencies": [] });
const alreadyUI5dependency = (UI5dependency) => packageJSON.ui5.dependencies.find(dep => dep === UI5dependency);
const addUI5Dependency = (UI5dependency) => !(alreadyUI5dependency(UI5dependency)) && (packageJSON.ui5.dependencies.push(UI5dependency));
const addUI5Dependencies = () => ui5Dependencies.forEach(UI5dependency => addUI5Dependency(UI5dependency));
const processPackageJSON = () => {
    initScript();
    addScriptsToPackage();
    addDevDependencies();
    initUI5Depencies();
    addUI5Dependencies();
    let newJSONData = JSON.stringify(packageJSON, null, '\t');
    fs.writeFileSync(`${fromRepo}/package.json`, newJSONData);
};

const processManifest = async () => {
    const manifest = await getManifest();
    manifest["sap.cloud"] = cloud;
    setManifest(manifest);
};

console.log(`Start processing template files`);
processTemplateFiles();
console.log(`End processing template files`);
console.log(`Start processing package.json`);
processPackageJSON();
console.log(`End processing package.json`);
console.log(`Start processing manifest`);
processManifest();
console.log(`End processing manifest`);