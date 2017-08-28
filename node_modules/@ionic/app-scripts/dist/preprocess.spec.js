"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var preprocess = require("./preprocess");
var deeplink = require("./deep-linking");
var helpers = require("./util/helpers");
var optimization = require("./optimization");
var globUtil = require("./util/glob-util");
describe('Preprocess Task', function () {
    describe('preprocess', function () {
        it('should call deepLink but not optimization or write files to disk', function () {
            // arrange
            var context = {
                optimizeJs: false
            };
            var mockDirName = path_1.join('some', 'fake', 'dir');
            var mockGlobResults = [];
            mockGlobResults.push({ absolutePath: mockDirName });
            mockGlobResults.push({ absolutePath: mockDirName + '2' });
            spyOn(deeplink, deeplink.deepLinking.name).and.returnValue(Promise.resolve());
            spyOn(optimization, optimization.optimization.name).and.returnValue(Promise.resolve());
            spyOn(helpers, helpers.getBooleanPropertyValue.name).and.returnValue(false);
            spyOn(preprocess, preprocess.writeFilesToDisk.name).and.returnValue(null);
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(mockDirName);
            spyOn(globUtil, globUtil.globAll.name).and.returnValue(Promise.resolve(mockGlobResults));
            // act
            return preprocess.preprocess(context).then(function () {
                // assert
                expect(optimization.optimization).not.toHaveBeenCalled();
                expect(preprocess.writeFilesToDisk).not.toHaveBeenCalledWith();
            });
        });
        it('should call optimization or write files to disk', function () {
            // arrange
            var context = {
                optimizeJs: true
            };
            var mockDirName = path_1.join('some', 'fake', 'dir');
            var mockGlobResults = [];
            mockGlobResults.push({ absolutePath: mockDirName });
            mockGlobResults.push({ absolutePath: mockDirName + '2' });
            spyOn(deeplink, deeplink.deepLinking.name).and.returnValue(Promise.resolve());
            spyOn(optimization, optimization.optimization.name).and.returnValue(Promise.resolve());
            spyOn(helpers, helpers.getBooleanPropertyValue.name).and.returnValue(false);
            spyOn(preprocess, preprocess.writeFilesToDisk.name).and.returnValue(null);
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(mockDirName);
            spyOn(globUtil, globUtil.globAll.name).and.returnValue(Promise.resolve(mockGlobResults));
            // act
            return preprocess.preprocess(context).then(function () {
                // assert
                expect(optimization.optimization).toHaveBeenCalled();
                expect(preprocess.writeFilesToDisk).not.toHaveBeenCalledWith();
            });
        });
    });
});
