/**
 * @file processes inkscape SVGs to remove extra properties and attributes not needed for web.
 * 
 * Removes properties and attributes under the inkscape and sodipodi namespaces.
 * Also removes whitespace from the files to save on bytes.
 */
const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

function run() {
    const namespaces = ['inkscape', 'sodipodi'];
    const srcDir = path.resolve(__dirname, 'inkscape');
    const outDir = path.resolve(__dirname, '../../public/images');
    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
        if (file.endsWith('.svg')) {
            removeNamespaces(`${srcDir}/${file}`, `${outDir}/${file}`, namespaces);
        }
    });
}

function removeNamespaces(src, dest, namespaces) {
    if (!src || !dest || !namespaces) {
        throw "src, dest, and namespaces arguments are required.";
    }
    if (!Array.isArray(namespaces) || namespaces.length == 0) {
        throw "No namespaces provided.";
    }
    let xml = fs.readFileSync(src);
    let json = convert.xml2json(xml);
    let pojo = JSON.parse(json);
    let jsonCleaned = removeNamespacesRecursive(pojo, namespaces);
    let svg = convert.json2xml(jsonCleaned);
    fs.writeFileSync(dest, svg);
}

function removeNamespacesRecursive(jsonDoc, namespaces) {
    if (!jsonDoc.elements) return jsonDoc;
    jsonDoc.elements = jsonDoc.elements.map(element => {
        for (let i = 0; i < namespaces.length; i++) {
            const ns = namespaces[i];
            if (element.name && element.name.indexOf(`${ns}:`) == 0) {
                return null;
            }
            if (element.attributes) {
                for (let _key in element.attributes) {
                    if (_key.indexOf(`${ns}:`) == 0) {
                        delete element.attributes[_key];
                    }
                }
            }
        }          
        if (element.elements) {
            removeNamespacesRecursive(element, namespaces);
        }
        return element;
    }).filter(element => element != null);
    return jsonDoc;
}

run();