const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const processImages = require('./processImages');

const srcPath = path.resolve(__dirname,  '../src');
const destPath = path.resolve(__dirname, '../public');
const version = require('../package.json').version;

async function run() {    
    await new Promise(function(resolve, reject) {
        rimraf(destPath, function (err) {
            if (err) reject(err);
            resolve();
        });
    });
    console.info("removed public dir");    
    publishDir(srcPath, destPath, version);
    console.info("published root dir");
    publishDir(srcPath + '/css', destPath + '/css', version, true);
    console.info("published css");
    publishDir(srcPath + '/js', destPath + '/js', version, true);
    console.info("published js");
    processImages(srcPath + '/images/inkscape', destPath + '/images');
    console.info("published images");
    console.info("all done");
}

function publishDir(srcPath, destPath, version, recursive = false) {
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);        
    const files = fs.readdirSync(srcPath, { withFileTypes: true });
    files.forEach(file => {
        if (file['isFile']()) {
            publishFile(`${srcPath}/${file.name}`, `${destPath}/${file.name}`, version);
        }
        if (file['isDirectory']() && recursive) {
            publishDir(`${srcPath}/${file.name}`, `${destPath}/${file.name}`, version, recursive);
        }
    });
}

function publishFile(srcPath, destPath, version) {
    if (!isBinaryExtension(srcPath)) {
        const fileContent = fs.readFileSync(srcPath, 'utf8');
        const versionedContent = fileContent.replace(/\{__VER__\}/g, version);
        fs.writeFileSync(destPath, versionedContent);
    } else {
        fs.copyFileSync(srcPath, destPath);
    }
    
}

function isBinaryExtension(filepath) {
    let textExtensions = ['.html', '.css', '.js'];
    if (textExtensions.indexOf(path.extname(filepath)) !== -1) {
        return false;
    }
    return true;
}

run();