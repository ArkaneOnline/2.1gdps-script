const exe = require('@angablue/exe');

const build = exe({
    entry: './src/app.js',
    out: './build/gdps-script.exe',
    target: 'latest-win-x64'
});

build.then(() => console.log('Build completed!'));