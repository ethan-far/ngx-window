import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';

const { checkNpmRelease, main } = require('./check-npm-release.cjs');

describe('checkNpmRelease', () => {
    let rootDirectory: string;
    let request: jest.Mock;

    function writeManifest(path: string, value: unknown) {
        const target = join(rootDirectory, path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, JSON.stringify(value));
    }

    beforeEach(() => {
        rootDirectory = mkdtempSync(join(tmpdir(), 'ngx-window-publish-'));
        writeManifest('package.json', { version: '0.5.2' });
        writeManifest('projects/ngx-window/package.json', { name: 'ngx-window-component', version: '0.5.2' });
        writeManifest('package-lock.json', { version: '0.5.2', packages: { '': { version: '0.5.2' } } });
        writeManifest('dist/ngx-window/package.json', { name: 'ngx-window-component', version: '0.5.2' });
        request = jest.fn().mockResolvedValue({ status: 404 });
    });

    afterEach(() => {
        const target = resolve(rootDirectory);

        if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith('ngx-window-publish-')) {
            throw new Error('Refusing to remove a directory outside the test temporary directory.');
        }

        rmSync(target, { recursive: true, force: true });
    });

    it('allows an unpublished version and uses the public registry', async () => {
        const result = await checkNpmRelease({ rootDirectory, request, outputPath: null });

        expect(result).toEqual({ name: 'ngx-window-component', version: '0.5.2', publish: true, tag: 'latest' });
        expect(request).toHaveBeenCalledWith('https://registry.npmjs.org/ngx-window-component/0.5.2', expect.objectContaining({ signal: expect.anything() }));
    });

    it('skips an already published version', async () => {
        request.mockResolvedValue({ status: 200, json: async () => ({ name: 'ngx-window-component', version: '0.5.2' }) });

        const result = await checkNpmRelease({ rootDirectory, request, outputPath: null });

        expect(result.publish).toBe(false);
    });

    it.each([401, 403, 429, 500])('fails on registry HTTP %s instead of treating it as a missing version', async status => {
        request.mockResolvedValue({ status });

        await expect(checkNpmRelease({ rootDirectory, request, outputPath: null })).rejects.toThrow(`HTTP ${status}`);
    });

    it('surfaces network failures', async () => {
        request.mockRejectedValue(new Error('Network unavailable'));

        await expect(checkNpmRelease({ rootDirectory, request, outputPath: null })).rejects.toThrow('Network unavailable');
    });

    it('rejects unexpected metadata for a published version', async () => {
        request.mockResolvedValue({ status: 200, json: async () => ({ name: 'another-package', version: '0.5.2' }) });

        await expect(checkNpmRelease({ rootDirectory, request, outputPath: null })).rejects.toThrow('unexpected package metadata');
    });

    it.each([
        ['package.json', { version: '0.5.1' }],
        ['package-lock.json', { version: '0.5.1', packages: { '': { version: '0.5.2' } } }],
        ['package-lock.json', { version: '0.5.2', packages: { '': { version: '0.5.1' } } }],
        ['package-lock.json', { version: '0.5.2' }],
        ['dist/ngx-window/package.json', { name: 'ngx-window-component', version: '0.5.1' }]
    ])('rejects inconsistent release metadata in %s', async (path, manifest) => {
        writeManifest(path as string, manifest);

        await expect(checkNpmRelease({ rootDirectory, request, outputPath: null })).rejects.toThrow('versions must match');
        expect(request).not.toHaveBeenCalled();
    });

    it('rejects an incorrectly named build artifact', async () => {
        writeManifest('dist/ngx-window/package.json', { name: 'another-package', version: '0.5.2' });

        await expect(checkNpmRelease({ rootDirectory, request, outputPath: null })).rejects.toThrow('built package name');
        expect(request).not.toHaveBeenCalled();
    });

    it.each([{ version: '0.5.2' }, { name: 'ngx-window-component' }, { name: '', version: '0.5.2' }, { name: 'ngx-window-component', version: '' }])('rejects missing package identity (%j)', async manifest => {
        writeManifest('projects/ngx-window/package.json', manifest);

        await expect(checkNpmRelease({ rootDirectory, request, outputPath: null })).rejects.toThrow('name and version');
        expect(request).not.toHaveBeenCalled();
    });

    it('writes the publish decision to GitHub Actions outputs', async () => {
        const outputPath = join(rootDirectory, 'outputs');

        await checkNpmRelease({ rootDirectory, request, outputPath });

        expect(readFileSync(outputPath, 'utf8')).toBe('publish=true\ntag=latest\n');
    });

    it('uses the default repository location, global fetch, and GitHub output file', async () => {
        const originalFetch = globalThis.fetch;
        const originalOutput = process.env.GITHUB_OUTPUT;
        const outputPath = join(rootDirectory, 'default-outputs');
        const actualFs = jest.requireActual('node:fs');
        globalThis.fetch = request;
        process.env.GITHUB_OUTPUT = outputPath;
        let defaultCheck: () => Promise<unknown>;

        try {
            jest.isolateModules(() => {
                jest.doMock('node:fs', () => ({
                    appendFileSync: actualFs.appendFileSync,
                    readFileSync: (path: string) => actualFs.readFileSync(join(rootDirectory, relative(resolve(__dirname, '..'), path)), 'utf8')
                }));
                defaultCheck = require('./check-npm-release.cjs').checkNpmRelease;
            });

            await defaultCheck!();

            expect(readFileSync(outputPath, 'utf8')).toBe('publish=true\ntag=latest\n');
            expect(request).toHaveBeenCalled();
        } finally {
            jest.dontMock('node:fs');
            globalThis.fetch = originalFetch;

            if (originalOutput === undefined) {
                delete process.env.GITHUB_OUTPUT;
            } else {
                process.env.GITHUB_OUTPUT = originalOutput;
            }
        }
    });

    describe('command-line reporting', () => {
        it.each([true, false])('reports whether publication is needed (%s)', async publish => {
            const log = jest.spyOn(console, 'log').mockImplementation(() => {});
            request.mockResolvedValue({ status: publish ? 404 : 200, json: async () => ({ name: 'ngx-window-component', version: '0.5.2' }) });

            try {
                await main({ rootDirectory, request, outputPath: null });

                expect(log).toHaveBeenCalledWith(publish
                    ? 'Ready to publish ngx-window-component@0.5.2 with the latest tag.'
                    : 'ngx-window-component@0.5.2 is already published; skipping.');
            } finally {
                log.mockRestore();
            }
        });

        it('reports errors and sets a failing process status', async () => {
            const originalExitCode = process.exitCode;
            const error = jest.spyOn(console, 'error').mockImplementation(() => {});
            request.mockRejectedValue(new Error('Registry unavailable'));

            try {
                await main({ rootDirectory, request, outputPath: null });

                expect(error).toHaveBeenCalledWith('Registry unavailable');
                expect(process.exitCode).toBe(1);
            } finally {
                process.exitCode = originalExitCode;
                error.mockRestore();
            }
        });
    });

    it('keeps prerelease versions off the latest tag', async () => {
        const version = '0.6.0-rc.1';
        writeManifest('package.json', { version });
        writeManifest('projects/ngx-window/package.json', { name: 'ngx-window-component', version });
        writeManifest('package-lock.json', { version, packages: { '': { version } } });
        writeManifest('dist/ngx-window/package.json', { name: 'ngx-window-component', version });

        const result = await checkNpmRelease({ rootDirectory, request, outputPath: null });

        expect(result.tag).toBe('next');
    });
});
