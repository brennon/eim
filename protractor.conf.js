exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['public/e2e/*.js'],
    jasmineNodeOpts: {
        showTiming: true
    }
};