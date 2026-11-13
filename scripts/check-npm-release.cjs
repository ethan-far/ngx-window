const { appendFileSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

async function checkNpmRelease({
    rootDirectory = resolve(__dirname, '..'),
    request = globalThis.fetch,
    outputPath = process.env.GITHUB_OUTPUT
} = {}) {
    const [root, library, lockfile, built] = [
        'package.json',
        'projects/ngx-window/package.json',
        'package-lock.json',
        'dist/ngx-window/package.json'
    ].map(path => JSON.parse(readFileSync(resolve(rootDirectory, path), 'utf8')));

    if (typeof library.name !== 'string' || !library.name || typeof library.version !== 'string' || !library.version) {
        throw new Error('The library package must have a name and version.');
    }

    if (built.name !== library.name) {
        throw new Error('The built package name does not match the library manifest.');
    }

    if ([root.version, lockfile.version, lockfile.packages?.['']?.version, built.version].some(version => version !== library.version)) {
        throw new Error('Root, library, lockfile, and built package versions must match before publishing.');
    }

    const { name, version } = library;
    const response = await request(`https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`, {
        signal: AbortSignal.timeout(30000)
    });

    if (response.status !== 200 && response.status !== 404) {
        throw new Error(`npm registry returned HTTP ${response.status}; refusing to assume the version is unpublished.`);
    }

    if (response.status === 200) {
        const published = await response.json();

        if (published.name !== name || published.version !== version) {
            throw new Error('npm registry returned unexpected package metadata.');
        }
    }

    const result = { name, version, publish: response.status === 404, tag: version.includes('-') ? 'next' : 'latest' };

    if (outputPath) {
        appendFileSync(outputPath, `publish=${result.publish}\ntag=${result.tag}\n`);
    }

    return result;
}

async function main(options) {
    try {
        const result = await checkNpmRelease(options);
        console.log(result.publish
            ? `Ready to publish ${result.name}@${result.version} with the ${result.tag} tag.`
            : `${result.name}@${result.version} is already published; skipping.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}

module.exports = { checkNpmRelease, main };

if (require.main === module) {
    main();
}
