"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_LEVELS = ['debug', 'info', 'ok', 'warn', 'error'];
function isCommand(cmd) {
    return typeof cmd.run === 'function';
}
exports.isCommand = isCommand;
function isCommandPreRun(cmd) {
    return typeof cmd.preRun === 'function';
}
exports.isCommandPreRun = isCommandPreRun;
function isLogLevel(l) {
    const loglevel = l;
    return exports.LOG_LEVELS.includes(loglevel);
}
exports.isLogLevel = isLogLevel;
function isPackageJson(o) {
    const obj = o;
    return obj && typeof obj.name === 'string';
}
exports.isPackageJson = isPackageJson;
function isBowerJson(o) {
    const obj = o;
    return obj && typeof obj.name === 'string';
}
exports.isBowerJson = isBowerJson;
function isExitCodeException(e) {
    const err = e;
    return err && typeof err.exitCode === 'number' && err.exitCode >= 0 && err.exitCode <= 255;
}
exports.isExitCodeException = isExitCodeException;
function isValidationErrorArray(e) {
    const err = e;
    return err && err[0]
        && typeof err[0].message === 'string'
        && typeof err[0].inputName === 'string';
}
exports.isValidationErrorArray = isValidationErrorArray;
function isPlugin(p) {
    const plugin = p;
    return plugin
        && typeof plugin.name === 'string'
        && typeof plugin.version === 'string';
}
exports.isPlugin = isPlugin;
function isSuperAgentError(e) {
    const err = e;
    return e && err.response && typeof err.response === 'object';
}
exports.isSuperAgentError = isSuperAgentError;
function isAPIResponseSuccess(r) {
    const res = r;
    return res && (typeof res.data === 'object' || typeof res.data === 'string');
}
exports.isAPIResponseSuccess = isAPIResponseSuccess;
function isAPIResponseError(r) {
    const res = r;
    return res && typeof res.error === 'object';
}
exports.isAPIResponseError = isAPIResponseError;
function isAppDetails(d) {
    const details = d;
    return details && typeof details === 'object'
        && typeof details.id === 'string'
        && typeof details.name === 'string'
        && typeof details.slug === 'string';
}
exports.isAppDetails = isAppDetails;
function isAppResponse(r) {
    const res = r;
    return isAPIResponseSuccess(res) && isAppDetails(res.data);
}
exports.isAppResponse = isAppResponse;
function isAppsResponse(r) {
    let res = r;
    if (!isAPIResponseSuccess(res) || !Array.isArray(res.data)) {
        return false;
    }
    if (res.data.length > 0) {
        return isAppDetails(res.data[0]);
    }
    return true;
}
exports.isAppsResponse = isAppsResponse;
function isAuthTokensResponse(r) {
    const res = r;
    if (!isAPIResponseSuccess(res) || !Array.isArray(res.data)) {
        return false;
    }
    if (res.data.length > 0) {
        return typeof res.data[0].token === 'string'
            && typeof res.data[0].details === 'object'
            && typeof res.data[0].details.app_id === 'string'
            && typeof res.data[0].details.type === 'string'
            && typeof res.data[0].details.user_id === 'string';
    }
    return true;
}
exports.isAuthTokensResponse = isAuthTokensResponse;
function isLegacyLoginResponse(r) {
    const res = r;
    return isAPIResponseSuccess(r) && typeof res.data.token === 'string';
}
exports.isLegacyLoginResponse = isLegacyLoginResponse;
function isProLoginResponse(r) {
    const res = r;
    return isAPIResponseSuccess(r)
        && typeof res.data.user === 'object'
        && typeof res.data.user.id === 'number'
        && typeof res.data.user.email === 'string'
        && typeof res.data.token === 'string';
}
exports.isProLoginResponse = isProLoginResponse;
function isSSHKeyListResponse(r) {
    const res = r;
    if (!isAPIResponseSuccess(r) || !Array.isArray(r.data)) {
        return false;
    }
    if (typeof r.data[0] === 'object') {
        return typeof res.data[0].id === 'string'
            && typeof res.data[0].pubkey === 'string'
            && typeof res.data[0].fingerprint === 'string'
            && typeof res.data[0].annotation === 'string'
            && typeof res.data[0].name === 'string'
            && typeof res.data[0].created === 'string'
            && typeof res.data[0].updated === 'string';
    }
    return true;
}
exports.isSSHKeyListResponse = isSSHKeyListResponse;
function isSSHKeyResponse(r) {
    const res = r;
    return isAPIResponseSuccess(r)
        && typeof res.data.id === 'string'
        && typeof res.data.pubkey === 'string'
        && typeof res.data.fingerprint === 'string'
        && typeof res.data.annotation === 'string'
        && typeof res.data.name === 'string'
        && typeof res.data.created === 'string'
        && typeof res.data.updated === 'string';
}
exports.isSSHKeyResponse = isSSHKeyResponse;
function isDeployResponse(r) {
    const res = r;
    return isAPIResponseSuccess(res)
        && typeof res.data.uuid === 'string'
        && typeof res.data.snapshot === 'string'
        && typeof res.data.channel === 'string';
}
exports.isDeployResponse = isDeployResponse;
function isPackageProjectRequestResponse(r) {
    const res = r;
    return isAPIResponseSuccess(res)
        && typeof res.data.id === 'number'
        && typeof res.data.presigned_post === 'object'
        && typeof res.data.presigned_post.url === 'string'
        && res.data.presigned_post.fields && typeof res.data.presigned_post.fields === 'object';
}
exports.isPackageProjectRequestResponse = isPackageProjectRequestResponse;
function isPackageBuild(o) {
    const obj = o;
    return obj && typeof obj === 'object'
        && typeof obj.id === 'number'
        && (!obj.name) || typeof obj.name === 'string'
        && typeof obj.created === 'string'
        && (!obj.completed || typeof obj.completed === 'string')
        && typeof obj.platform === 'string'
        && typeof obj.status === 'string'
        && typeof obj.mode === 'string'
        && (!obj.security_profile_tag || typeof obj.security_profile_tag === 'string')
        && (!obj.url || typeof obj.url === 'string');
}
exports.isPackageBuild = isPackageBuild;
function isSecurityProfile(o) {
    const obj = o;
    return obj && typeof obj === 'object'
        && typeof obj.name === 'string'
        && typeof obj.tag === 'string'
        && typeof obj.type === 'string'
        && typeof obj.created === 'string'
        && typeof obj.credentials === 'object';
}
exports.isSecurityProfile = isSecurityProfile;
function isSecurityProfileResponse(r) {
    const res = r;
    return isAPIResponseSuccess(res) && isSecurityProfile(res.data);
}
exports.isSecurityProfileResponse = isSecurityProfileResponse;
function isSecurityProfilesResponse(r) {
    const res = r;
    if (!isAPIResponseSuccess(res) || !Array.isArray(res.data)) {
        return false;
    }
    if (res.data.length > 0) {
        return isSecurityProfile(res.data[0]);
    }
    return true;
}
exports.isSecurityProfilesResponse = isSecurityProfilesResponse;
function isPackageBuildResponse(r) {
    const res = r;
    return isAPIResponseSuccess(res) && isPackageBuild(res.data);
}
exports.isPackageBuildResponse = isPackageBuildResponse;
function isPackageBuildsResponse(r) {
    const res = r;
    if (!isAPIResponseSuccess(res) || !Array.isArray(res.data)) {
        return false;
    }
    if (res.data.length > 0) {
        return isPackageBuild(res.data[0]);
    }
    return true;
}
exports.isPackageBuildsResponse = isPackageBuildsResponse;
function isDeployChannelResponse(r) {
    const res = r;
    return isAPIResponseSuccess(res)
        && typeof res.data.uuid === 'string'
        && typeof res.data.tag === 'string';
}
exports.isDeployChannelResponse = isDeployChannelResponse;
function isDeploySnapshotResponse(r) {
    const res = r;
    return isAPIResponseSuccess(res)
        && typeof res.data.uuid === 'string'
        && typeof res.data.url === 'string';
}
exports.isDeploySnapshotResponse = isDeploySnapshotResponse;
function isDeploySnapshotRequestResponse(r) {
    const res = r;
    return isAPIResponseSuccess(res)
        && typeof res.data.uuid === 'string'
        && typeof res.data.presigned_post === 'object'
        && typeof res.data.presigned_post.url === 'string'
        && res.data.presigned_post.fields && typeof res.data.presigned_post.fields === 'object';
}
exports.isDeploySnapshotRequestResponse = isDeploySnapshotRequestResponse;
