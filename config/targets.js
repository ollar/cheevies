'use strict';

let browsers;

if (process.env.CORBER) {
    browsers = [`last 1 ${process.env.CORBER_PLATFORM} versions`];
} else {
    browsers = ['last 1 Chrome versions', 'last 1 Firefox versions', 'last 1 Safari versions'];
}

module.exports = {
    browsers,
};
