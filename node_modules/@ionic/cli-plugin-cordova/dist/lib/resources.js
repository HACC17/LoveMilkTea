"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const cli_utils_1 = require("@ionic/cli-utils");
const SUPPORTED_SOURCE_EXTENSIONS = ['.psd', '.ai', '.png'];
const UPLOAD_URL = 'https://res.ionic.io/api/v1/upload';
const TRANSFORM_URL = 'https://res.ionic.io/api/v1/transform';
const DEFAULT_RESOURCES_DIR = path.resolve(__dirname, '..', 'default-resources');
/**
 * Take the JSON structure for resources.json and turn it into a flat array
 * that contains only images and turns all struture info into attributes of the image
 * items.
 */
function flattenResourceJsonStructure() {
    return cli_utils_1.flattenArray(Object.keys(exports.RESOURCES).map(platform => (Object.keys(exports.RESOURCES[platform]).map(resType => (exports.RESOURCES[platform][resType]['images'].map((imgInfo) => ({
        platform,
        resType,
        name: imgInfo.name,
        width: imgInfo.width,
        height: imgInfo.height,
        density: imgInfo.density,
        orientation: imgInfo.orientation,
        nodeName: exports.RESOURCES[platform][resType]['nodeName'],
        nodeAttributes: exports.RESOURCES[platform][resType]['nodeAttributes']
    })))))));
}
exports.flattenResourceJsonStructure = flattenResourceJsonStructure;
/**
 * Create the destination directories for the provided image resources.
 */
function createImgDestinationDirectories(imgResources) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const buildDirPromises = imgResources
            .map(img => path.dirname(img.dest))
            .filter((dir, index, dirNames) => dirNames.indexOf(dir) === index)
            .map(dir => cli_utils_1.fsMkdirp(dir));
        return Promise.all(buildDirPromises);
    });
}
exports.createImgDestinationDirectories = createImgDestinationDirectories;
/**
 * Find all source images within the resources directory
 */
function getSourceImages(buildPlatforms, resourceTypes, resourceDir) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const srcDirList = buildPlatforms
            .map(platform => ({
            platform,
            path: path.join(resourceDir, platform),
        }))
            .concat({
            platform: 'global',
            path: resourceDir
        });
        const srcImageDirContentList = yield Promise.all(srcDirList.map(srcImgDir => cli_utils_1.readDir(srcImgDir.path)));
        const sourceImages = cli_utils_1.flattenArray(srcImageDirContentList.map((srcImageDirContents, index) => (srcImageDirContents
            .map((imgName) => {
            const ext = path.extname(imgName);
            return {
                ext,
                platform: srcDirList[index].platform,
                resType: path.basename(imgName, ext),
                path: path.join(srcDirList[index].path, imgName),
                vector: false,
                height: 0,
                width: 0,
            };
        })
            .filter(img => SUPPORTED_SOURCE_EXTENSIONS.includes(img.ext))
            .filter(img => resourceTypes.includes(img.resType)))));
        const sourceImageChecksums = yield Promise.all(sourceImages.map((img) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cachedMd5Path = `${img.path}.md5`;
            const [md5, cachedMd5] = yield Promise.all([
                cli_utils_1.getFileChecksum(img.path),
                (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        const md5 = yield cli_utils_1.fsReadFile(cachedMd5Path, { encoding: 'utf8' });
                        return md5.trim();
                    }
                    catch (e) {
                        if (e.code !== 'ENOENT') {
                            throw e;
                        }
                    }
                }))(),
            ]);
            if (cachedMd5) {
                img.cachedId = cachedMd5;
            }
            yield cli_utils_1.fsWriteFile(cachedMd5Path, md5, { encoding: 'utf8' });
            return md5;
        })));
        return sourceImages.map((img, index) => (Object.assign({}, img, { imageId: sourceImageChecksums[index] })));
    });
}
exports.getSourceImages = getSourceImages;
/**
 * Find the source image that matches the requirements of the image resource provided.
 */
function findMostSpecificImage(imageResource, srcImagesAvailable) {
    return srcImagesAvailable.reduce((mostSpecificImage, sourceImage) => {
        if (sourceImage.platform === imageResource.platform && sourceImage.resType === imageResource.resType) {
            return sourceImage;
        }
        if (sourceImage.platform === 'global' && sourceImage.resType === imageResource.resType && !mostSpecificImage) {
            return sourceImage;
        }
        return mostSpecificImage;
    }, null);
}
exports.findMostSpecificImage = findMostSpecificImage;
/**
 * Upload the provided source image through the resources web service. This will make it available
 * for transforms for the next 5 minutes.
 */
function uploadSourceImages(srcImages) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Promise.all(srcImages.map((srcImage) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield cli_utils_1.createRequest('POST', UPLOAD_URL)
                .type('form')
                .attach('src', srcImage.path)
                .field('image_id', srcImage.imageId || '');
            return res.body;
        })));
    });
}
exports.uploadSourceImages = uploadSourceImages;
/**
 * Using the transformation web service transform the provided image resource
 * into the appropriate w x h and then write this file to the provided destination directory.
 */
function transformResourceImage(imageResource) {
    return new Promise((resolve, reject) => {
        const req = cli_utils_1.createRequest('POST', TRANSFORM_URL)
            .type('form')
            .send({
            'name': imageResource.name,
            'image_id': imageResource.imageId,
            'width': imageResource.width,
            'height': imageResource.height,
            'res_type': imageResource.resType,
            'crop': 'center',
            'encoding': 'png',
        })
            .on('response', (res) => {
            if (res.statusCode !== 200) {
                let bufs = [];
                res.on('data', (chunk) => {
                    bufs.push(chunk);
                });
                res.on('end', () => {
                    const buf = Buffer.concat(bufs);
                    const body = buf.toString();
                    reject(new Error(`encountered bad status code (${res.statusCode}) for ${TRANSFORM_URL}\nbody: ${body}`));
                });
            }
        })
            .on('error', (err) => {
            if (err.code === 'ECONNABORTED') {
                reject(new Error(`timeout of ${err.timeout}ms reached for ${TRANSFORM_URL}`));
            }
            else {
                reject(err);
            }
        });
        cli_utils_1.writeStreamToFile(req, imageResource.dest).then(resolve, reject);
    });
}
exports.transformResourceImage = transformResourceImage;
/**
 * Add images within the Default resources directory to the resources directory for the provided platform.
 * Also write this information to the project's config.xml file
 */
function addDefaultImagesToProjectResources(projectDirectory, platform) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Copy default resources into the platform directory
        const resourcesDir = path.resolve(projectDirectory, 'resources', platform);
        const platformResourceDir = path.resolve(DEFAULT_RESOURCES_DIR, platform);
        yield cli_utils_1.fsMkdirp(platformResourceDir);
        yield cli_utils_1.copyDirectory(platformResourceDir, resourcesDir);
    });
}
exports.addDefaultImagesToProjectResources = addDefaultImagesToProjectResources;
/**
 * Add image resource references for the provided platforms to the project's config.xml file.
 */
function addResourcesToConfigXml(conf, platformList, resourceJson) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (let platform of platformList) {
            yield conf.ensurePlatformImages(platform, resourceJson[platform]);
        }
        yield conf.ensureSplashScreenPreferences();
    });
}
exports.addResourcesToConfigXml = addResourcesToConfigXml;
exports.RESOURCES = {
    android: {
        icon: {
            images: [
                { name: 'drawable-ldpi-icon.png', width: 36, height: 36, density: 'ldpi' },
                { name: 'drawable-mdpi-icon.png', width: 48, height: 48, density: 'mdpi' },
                { name: 'drawable-hdpi-icon.png', width: 72, height: 72, density: 'hdpi' },
                { name: 'drawable-xhdpi-icon.png', width: 96, height: 96, density: 'xhdpi' },
                { name: 'drawable-xxhdpi-icon.png', width: 144, height: 144, density: 'xxhdpi' },
                { name: 'drawable-xxxhdpi-icon.png', width: 192, height: 192, density: 'xxxhdpi' },
            ],
            nodeName: 'icon',
            nodeAttributes: ['src', 'density'],
        },
        splash: {
            images: [
                { name: 'drawable-land-ldpi-screen.png', width: 320, height: 240, density: 'land-ldpi', orientation: 'landscape' },
                { name: 'drawable-land-mdpi-screen.png', width: 480, height: 320, density: 'land-mdpi', orientation: 'landscape' },
                { name: 'drawable-land-hdpi-screen.png', width: 800, height: 480, density: 'land-hdpi', orientation: 'landscape' },
                { name: 'drawable-land-xhdpi-screen.png', width: 1280, height: 720, density: 'land-xhdpi', orientation: 'landscape' },
                { name: 'drawable-land-xxhdpi-screen.png', width: 1600, height: 960, density: 'land-xxhdpi', orientation: 'landscape' },
                { name: 'drawable-land-xxxhdpi-screen.png', width: 1920, height: 1280, density: 'land-xxxhdpi', orientation: 'landscape' },
                { name: 'drawable-port-ldpi-screen.png', width: 240, height: 320, density: 'port-ldpi', orientation: 'portrait' },
                { name: 'drawable-port-mdpi-screen.png', width: 320, height: 480, density: 'port-mdpi', orientation: 'portrait' },
                { name: 'drawable-port-hdpi-screen.png', width: 480, height: 800, density: 'port-hdpi', orientation: 'portrait' },
                { name: 'drawable-port-xhdpi-screen.png', width: 720, height: 1280, density: 'port-xhdpi', orientation: 'portrait' },
                { name: 'drawable-port-xxhdpi-screen.png', width: 960, height: 1600, density: 'port-xxhdpi', orientation: 'portrait' },
                { name: 'drawable-port-xxxhdpi-screen.png', width: 1280, height: 1920, density: 'port-xxxhdpi', orientation: 'portrait' },
            ],
            nodeName: 'splash',
            nodeAttributes: ['src', 'density'],
        }
    },
    ios: {
        icon: {
            images: [
                { name: 'icon.png', width: 57, height: 57 },
                { name: 'icon@2x.png', width: 114, height: 114 },
                { name: 'icon-40.png', width: 40, height: 40 },
                { name: 'icon-40@2x.png', width: 80, height: 80 },
                { name: 'icon-40@3x.png', width: 120, height: 120 },
                { name: 'icon-50.png', width: 50, height: 50 },
                { name: 'icon-50@2x.png', width: 100, height: 100 },
                { name: 'icon-60.png', width: 60, height: 60 },
                { name: 'icon-60@2x.png', width: 120, height: 120 },
                { name: 'icon-60@3x.png', width: 180, height: 180 },
                { name: 'icon-72.png', width: 72, height: 72 },
                { name: 'icon-72@2x.png', width: 144, height: 144 },
                { name: 'icon-76.png', width: 76, height: 76 },
                { name: 'icon-76@2x.png', width: 152, height: 152 },
                { name: 'icon-83.5@2x.png', width: 167, height: 167 },
                { name: 'icon-small.png', width: 29, height: 29 },
                { name: 'icon-small@2x.png', width: 58, height: 58 },
                { name: 'icon-small@3x.png', width: 87, height: 87 },
            ],
            nodeName: 'icon',
            nodeAttributes: ['src', 'width', 'height'],
        },
        splash: {
            images: [
                { name: 'Default-568h@2x~iphone.png', width: 640, height: 1136, orientation: 'portrait' },
                { name: 'Default-667h.png', width: 750, height: 1334, orientation: 'portrait' },
                { name: 'Default-736h.png', width: 1242, height: 2208, orientation: 'portrait' },
                { name: 'Default-Landscape-736h.png', width: 2208, height: 1242, orientation: 'landscape' },
                { name: 'Default-Landscape@2x~ipad.png', width: 2048, height: 1536, orientation: 'landscape' },
                { name: 'Default-Landscape@~ipadpro.png', width: 2732, height: 2048, orientation: 'landscape' },
                { name: 'Default-Landscape~ipad.png', width: 1024, height: 768, orientation: 'landscape' },
                { name: 'Default-Portrait@2x~ipad.png', width: 1536, height: 2048, orientation: 'portrait' },
                { name: 'Default-Portrait@~ipadpro.png', width: 2048, height: 2732, orientation: 'portrait' },
                { name: 'Default-Portrait~ipad.png', width: 768, height: 1024, orientation: 'portrait' },
                { name: 'Default@2x~iphone.png', width: 640, height: 960, orientation: 'portrait' },
                { name: 'Default~iphone.png', width: 320, height: 480, orientation: 'portrait' },
            ],
            nodeName: 'splash',
            nodeAttributes: ['src', 'width', 'height'],
        },
    },
    wp8: {
        icon: {
            images: [
                { name: 'ApplicationIcon.png', width: 99, height: 99 },
                { name: 'Background.png', width: 159, height: 159 },
            ],
            nodeName: 'icon',
            nodeAttributes: ['src', 'width', 'height'],
        },
        splash: {
            images: [
                { name: 'SplashScreenImage.png', width: 768, height: 1280 },
            ],
            nodeName: 'splash',
            nodeAttributes: ['src', 'width', 'height'],
        },
    },
};
