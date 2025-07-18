// ========= Copyright 2023-2024 @ CAMEL-AI.org. All Rights Reserved. =========
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ========= Copyright 2023-2024 @ CAMEL-AI.org. All Rights Reserved. =========

/**
 * Comprehensive stealth script to avoid bot detection
 * 
 * This script implements various anti-detection measures to make the browser
 * appear as a regular user browser rather than an automated one.
 */

Object.defineProperty(navigator, 'webdriver', {
    get: () => undefined,
    configurable: true
});

// Completely remove webdriver from navigator
delete navigator.webdriver;

// Remove automation indicators
delete window.navigator.__defineGetter__('webdriver');
delete window.navigator.__lookupGetter__('webdriver');
delete window.navigator.__defineSetter__('webdriver');
delete window.navigator.__lookupSetter__('webdriver');

// Override webdriver property at various levels  
Object.defineProperty(window.navigator, 'webdriver', {
    get: () => undefined,
    configurable: true
});

// Remove webdriver from window as well
if ('webdriver' in window) {
    delete window.webdriver;
}

// Block all webdriver-related property access
const webdriverProps = ['webdriver', '__webdriver_evaluate', '__selenium_evaluate', '__webdriver_script_fn'];
webdriverProps.forEach(prop => {
    Object.defineProperty(window, prop, {
        get: () => undefined,
        set: () => {},
        configurable: true,
        enumerable: false
    });
    Object.defineProperty(navigator, prop, {
        get: () => undefined,
        set: () => {},
        configurable: true,
        enumerable: false
    });
});

// Override plugins length
Object.defineProperty(navigator, 'plugins', {
    get: () => ({
        length: 3,
        0: { name: 'Chrome PDF Plugin', description: 'Portable Document Format', filename: 'internal-pdf-viewer' },
        1: { name: 'Chrome PDF Viewer', description: '', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
        2: { name: 'Native Client', description: '', filename: 'internal-nacl-plugin' },
        item: function(index) { return this[index] || null; },
        namedItem: function(name) {
            for (let i = 0; i < this.length; i++) {
                if (this[i].name === name) return this[i];
            }
            return null;
        },
        refresh: function() {}
    }),
    configurable: true
});

// Override languages
Object.defineProperty(navigator, 'languages', {
    get: () => ['en-US', 'en'],
    configurable: true
});

Object.defineProperty(navigator, 'language', {
    get: () => 'en-US',
    configurable: true
});

// Fix video codec detection
if (window.HTMLMediaElement && window.HTMLMediaElement.prototype.canPlayType) {
    const originalCanPlayType = window.HTMLMediaElement.prototype.canPlayType;
    window.HTMLMediaElement.prototype.canPlayType = function(type) {
        if (type.includes('h264') || type.includes('avc1')) {
            return 'probably';
        }
        if (type.includes('webm') || type.includes('vp8') || type.includes('vp9')) {
            return 'probably';
        }
        if (type.includes('ogg') || type.includes('theora')) {
            return 'maybe';
        }
        return originalCanPlayType.call(this, type);
    };
}

// Override permissions
const originalQuery = window.navigator.permissions && window.navigator.permissions.query;
if (originalQuery) {
    window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters)
    );
}

// Override chrome runtime
if (!window.chrome) {
    window.chrome = {};
}

// Remove automation-related properties safely
if (window.chrome) {
    delete window.chrome.loadTimes;
    delete window.chrome.csi;
}

window.chrome.runtime = {
    onConnect: undefined,
    onMessage: undefined,
    PlatformOs: {
        MAC: 'mac',
        WIN: 'win',
        ANDROID: 'android',
        CROS: 'cros',
        LINUX: 'linux',
        OPENBSD: 'openbsd'
    },
    PlatformArch: {
        ARM: 'arm',
        X86_32: 'x86-32',
        X86_64: 'x86-64'
    },
    PlatformNaclArch: {
        ARM: 'arm',
        X86_32: 'x86-32',
        X86_64: 'x86-64'
    },
    RequestUpdateCheckStatus: {
        THROTTLED: 'throttled',
        NO_UPDATE: 'no_update',
        UPDATE_AVAILABLE: 'update_available'
    },
    OnInstalledReason: {
        INSTALL: 'install',
        UPDATE: 'update',
        CHROME_UPDATE: 'chrome_update',
        SHARED_MODULE_UPDATE: 'shared_module_update'
    },
    OnRestartRequiredReason: {
        APP_UPDATE: 'app_update',
        OS_UPDATE: 'os_update',
        PERIODIC: 'periodic'
    }
};

// Hide automation test properties
['__driver_evaluate', '__webdriver_evaluate', '__selenium_evaluate', '__fxdriver_evaluate', 
 '__driver_unwrapped', '__webdriver_unwrapped', '__selenium_unwrapped', '__fxdriver_unwrapped',
 '__webdriver_script_fn', '__webdriver_script_func', '__webdriver_script_function'].forEach(prop => {
    Object.defineProperty(window, prop, {
        get: () => undefined,
        configurable: true
    });
});

// Mock battery API
if (!navigator.getBattery) {
    navigator.getBattery = () => Promise.resolve({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true
    });
}

// Override connection info
Object.defineProperty(navigator, 'connection', {
    get: () => ({
        effectiveType: '4g',
        type: 'wifi',
        downlink: 10,
        rtt: 50,
        saveData: false
    }),
    configurable: true
});

// Override hardwareConcurrency
Object.defineProperty(navigator, 'hardwareConcurrency', {
    get: () => 8,
    configurable: true
});

// Override deviceMemory
Object.defineProperty(navigator, 'deviceMemory', {
    get: () => 8,
    configurable: true
});

// Fix WebGL vendor/renderer
const getParameter = WebGLRenderingContext.prototype.getParameter;
WebGLRenderingContext.prototype.getParameter = function(parameter) {
    if (parameter === 37445) {
        return 'Intel Inc.';
    }
    if (parameter === 37446) {
        return 'Intel(R) Iris(TM) Graphics 6100';
    }
    return getParameter.call(this, parameter);
};

// Remove callstack fingerprinting
Error.captureStackTrace = undefined;

// Remove iframe sandbox detection
Object.defineProperty(HTMLIFrameElement.prototype, 'sandbox', {
    get: function() { 
        return '';
    },
    set: function() {},
    configurable: true
});

// Override User-Agent Client Hints
if (navigator.userAgentData) {
    Object.defineProperty(navigator, 'userAgentData', {
        get: () => ({
            brands: [
                {brand: 'Google Chrome', version: '131'},
                {brand: 'Chromium', version: '131'},
                {brand: 'Not=A?Brand', version: '24'}
            ],
            mobile: false,
            platform: 'Windows',
            getHighEntropyValues: async (hints) => ({
                architecture: 'x86',
                bitness: '64',
                brands: [
                    {brand: 'Google Chrome', version: '131.0.6778.85'},
                    {brand: 'Chromium', version: '131.0.6778.85'},
                    {brand: 'Not=A?Brand', version: '24.0.0.0'}
                ],
                fullVersionList: [
                    {brand: 'Google Chrome', version: '131.0.6778.85'},
                    {brand: 'Chromium', version: '131.0.6778.85'},
                    {brand: 'Not=A?Brand', version: '24.0.0.0'}
                ],
                mobile: false,
                model: '',
                platform: 'Windows',
                platformVersion: '10.0.0',
                uaFullVersion: '131.0.6778.85',
                wow64: false
            }),
            toJSON: function() { return JSON.stringify(this); }
        }),
        configurable: true
    });
}

// Enhanced media capabilities for codec support
if (navigator.mediaCapabilities) {
    const originalDecodingInfo = navigator.mediaCapabilities.decodingInfo;
    navigator.mediaCapabilities.decodingInfo = async function(configuration) {
        if (configuration.type === 'file' || configuration.type === 'media-source') {
            const videoConfig = configuration.video;
            if (videoConfig && (videoConfig.contentType.includes('h264') || videoConfig.contentType.includes('avc1'))) {
                return {
                    supported: true,
                    smooth: true,
                    powerEfficient: true
                };
            }
        }
        return originalDecodingInfo.call(this, configuration);
    };
}

// Override MediaSource.isTypeSupported for better codec support
if (window.MediaSource && MediaSource.isTypeSupported) {
    const originalIsTypeSupported = MediaSource.isTypeSupported;
    MediaSource.isTypeSupported = function(type) {
        if (type.includes('h264') || type.includes('avc1')) {
            return true;
        }
        if (type.includes('webm') || type.includes('vp8') || type.includes('vp9')) {
            return true;
        }
        return originalIsTypeSupported.call(this, type);
    };
}

// Fix screen properties
Object.defineProperty(screen, 'availWidth', {
    get: () => 1920,
    configurable: true
});

Object.defineProperty(screen, 'availHeight', {
    get: () => 1040,
    configurable: true
});

Object.defineProperty(screen, 'colorDepth', {
    get: () => 24,
    configurable: true
});

Object.defineProperty(screen, 'pixelDepth', {
    get: () => 24,
    configurable: true
});

// Mock notification permission
if (window.Notification) {
    Object.defineProperty(Notification, 'permission', {
        get: () => 'default',
        configurable: true
    });
}

// Remove automation detection from common frameworks
if (window.$chrome_asyncScriptInfo) delete window.$chrome_asyncScriptInfo;
if (window.$cdc_asdjflasutopfhvcZLmcfl_) delete window.$cdc_asdjflasutopfhvcZLmcfl_;

// Enhanced CDC detection removal - critical for modern bot detection
const cdcPattern = /\$cdc_[a-zA-Z0-9]+_/;
Object.getOwnPropertyNames(window).forEach(prop => {
    if (cdcPattern.test(prop)) {
        delete window[prop];
    }
});

// Remove all potential automation variables
const automationVars = [
    '__webdriver_evaluate', '__selenium_evaluate', '__webdriver_script_fn',
    '__webdriver_script_func', '__webdriver_script_function', '__fxdriver_evaluate',
    '__driver_unwrapped', '__webdriver_unwrapped', '__selenium_unwrapped',
    '__fxdriver_unwrapped', '__webdriver_script_fn', '__nightmare', 'callPhantom',
    '_phantom', '__phantomas', 'phantom', 'calledSelenium', '$Selenium_IDE_Recorder',
    '$cdc_asdjflasutopfhvcZLmcfl_', 'geb', '__webdriverFunc', 'awesomium', 'domAutomation',
    'domAutomationController', '__lastWatirAlert', '__lastWatirConfirm', '__lastWatirPrompt',
    '_Selenium_IDE_Recorder', 'callSelenium', '_selenium', '__selenium_evaluate',
    '__selenium_unwrapped', '__fxdriver_evaluate', '__fxdriver_unwrapped', '__driver_evaluate',
    '__webdriver_evaluate', '__selenium_evaluate', '__webdriver_script_fn', '__webdriver_script_func'
];

automationVars.forEach(variable => {
    if (variable in window) {
        delete window[variable];
    }
    Object.defineProperty(window, variable, {
        get: () => undefined,
        set: () => {},
        configurable: true,
        enumerable: false
    });
});

// Prevent descriptor modification for webdriver
const descriptor = Object.getOwnPropertyDescriptor(navigator, 'webdriver');
if (descriptor) {
    Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
        set: () => {},
        configurable: false,
        enumerable: false
    });
}

// Hide automation from Function.toString()
const originalToString = Function.prototype.toString;
Function.prototype.toString = function() {
    const result = originalToString.call(this);
    // Hide webdriver references in function source
    return result.replace(/webdriver|selenium|automation|bot|phantom/gi, 'user');
};

// Block common detection patterns
const originalGetProperty = Object.getOwnPropertyDescriptor;
Object.getOwnPropertyDescriptor = function(target, property) {
    if (property === 'webdriver' && target === navigator) {
        return undefined;
    }
    return originalGetProperty.call(this, target, property);
};

// Override console.debug to prevent detection logging
if (window.console && window.console.debug) {
    const originalDebug = window.console.debug;
    window.console.debug = function(...args) {
        const message = args.join(' ');
        if (!message.includes('webdriver') && !message.includes('automation') && !message.includes('bot')) {
            originalDebug.apply(this, args);
        }
    };
}
