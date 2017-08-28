"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const cli_utils_1 = require("@ionic/cli-utils");
const et = require("elementtree");
class ConfigXml {
    get doc() {
        if (!this._doc) {
            throw new Error('No doc loaded. Call load() properly.');
        }
        return this._doc;
    }
    get filePath() {
        if (!this._filePath) {
            throw new Error('No file path given. Call load() properly.');
        }
        return this._filePath;
    }
    static load(projectDir) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!projectDir) {
                throw new Error('Must supply project directory.');
            }
            const conf = new ConfigXml();
            conf._filePath = path.join(projectDir, 'config.xml');
            const configFileContents = yield cli_utils_1.fsReadFile(conf.filePath, { encoding: 'utf8' });
            conf._doc = et.parse(configFileContents);
            return conf;
        });
    }
    save() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Cordova hard codes an indentation of 4 spaces, so we'll follow.
            const contents = this.doc.write({ indent: 4 });
            yield cli_utils_1.fsWriteFile(this.filePath, contents, { encoding: 'utf8' });
        });
    }
    /**
     * Update config.xml content src to be a dev server url. As part of this
     * backup the original content src for a reset to occur at a later time.
     */
    writeContentSrc(newSrc) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const root = this.doc.getroot();
            let contentElement = root.find('content');
            if (!contentElement) {
                contentElement = et.SubElement(root, 'content', { src: 'index.html' });
            }
            contentElement.set('original-src', contentElement.get('src'));
            contentElement.set('src', newSrc);
            let navElement = root.find(`allow-navigation[@href='${newSrc}']`);
            if (!navElement) {
                navElement = et.SubElement(root, 'allow-navigation', { href: newSrc });
            }
        });
    }
    /**
     * Set config.xml src url back to its original url
     */
    resetContentSrc() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const root = this.doc.getroot();
            let contentElement = root.find('content');
            if (!contentElement) {
                contentElement = et.SubElement(root, 'content', { src: 'index.html' });
            }
            const originalSrc = contentElement.get('original-src');
            if (originalSrc) {
                contentElement.set('src', originalSrc);
                delete contentElement.attrib['original-src'];
            }
        });
    }
    getPreference(prefName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const root = this.doc.getroot();
            const preferenceElement = root.find(`preference[@name='${prefName}']`);
            if (!preferenceElement) {
                return undefined;
            }
            const value = preferenceElement.get('value');
            if (!value) {
                return undefined;
            }
            return value;
        });
    }
    getProjectInfo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const root = this.doc.getroot();
            let id = root.get('id');
            if (!id) {
                id = '';
            }
            let version = root.get('version');
            if (!version) {
                version = '';
            }
            let nameElement = root.find('name');
            if (!nameElement) {
                nameElement = et.SubElement(root, 'name', {});
            }
            if (!nameElement.text) {
                nameElement.text = 'MyApp';
            }
            const name = nameElement.text;
            return { id, name, version };
        });
    }
    getPlatformEngine(platform) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const root = this.doc.getroot();
            const engine = root.find(`engine[@name='${platform}']`);
            if (!engine) {
                return undefined;
            }
            const spec = engine.get('spec');
            return Object.assign({ name: platform, spec: spec ? spec : '' }, engine.attrib);
        });
    }
    ensurePlatformImages(platform, resourcesPlatform) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const root = this.doc.getroot();
            const orientation = (yield this.getPreference('Orientation')) || 'default';
            for (let imgName in resourcesPlatform) {
                const imgType = resourcesPlatform[imgName];
                let platformElement = root.find(`platform[@name='${platform}']`);
                if (!platformElement) {
                    platformElement = et.SubElement(root, 'platform', { name: platform });
                }
                const images = imgType.images.filter(img => orientation === 'default' || typeof img.orientation === 'undefined' || img.orientation === orientation);
                for (let image of images) {
                    const imgPath = ['resources', platform, imgType.nodeName, image.name].join('/'); // TODO: hard-coded 'resources' dir
                    let imgElement = platformElement.find(`${imgType.nodeName}[@src='${imgPath}']`);
                    if (!imgElement) {
                        const attrs = {};
                        for (let attr of imgType.nodeAttributes) {
                            let v = image[attr]; // TODO
                            if (attr === 'src') {
                                v = imgPath;
                            }
                            attrs[attr] = v;
                        }
                        imgElement = et.SubElement(platformElement, imgType.nodeName, attrs);
                    }
                }
            }
        });
    }
    ensureSplashScreenPreferences() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const root = this.doc.getroot();
            let splashScreenPrefElement = root.find(`preference[@name='SplashScreen']`);
            if (!splashScreenPrefElement) {
                splashScreenPrefElement = et.SubElement(root, 'preference', { name: 'SplashScreen', value: 'screen' });
            }
            let splashShowOnlyFirstTimePrefElement = root.find(`preference[@name='SplashShowOnlyFirstTime']`);
            if (!splashShowOnlyFirstTimePrefElement) {
                splashShowOnlyFirstTimePrefElement = et.SubElement(root, 'preference', { name: 'SplashShowOnlyFirstTime', value: 'false' });
            }
            let splashScreenDelayPrefElement = root.find(`preference[@name='SplashScreenDelay']`);
            if (!splashScreenDelayPrefElement) {
                splashScreenDelayPrefElement = et.SubElement(root, 'preference', { name: 'SplashScreenDelay', value: '3000' });
            }
        });
    }
}
exports.ConfigXml = ConfigXml;
