# Contributing

We would love for you to contribute to `ngx-window` and help make it event better than it already is! Here are some guidelines to follow as a contributor:

- [Code of Conduct](#coc)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Submission Guidelines](#submit)
- [Coding Rules](#rules)


## <a name="coc"></a> Code of Conduct
Help us keep `NgxWindow` open and inclusive. Please read and follow our [Code of Conduct][coc].

## <a name="issue"></a> Found a Bug?
If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository][github]. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?
You can *request* a new feature by [submitting an issue](#submit-issue) to our GitHub
Repository. If you would like to *implement* a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be
discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
* **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs we will systematically ask you to provide a minimal reproduction scenario using https://stackblitz.com. Having a live, reproducible scenario gives us wealth of important information without going back & forth to you with additional questions like:

- Version of Angular used
- 3rd-party libraries and their versions
- And most importantly - a use-case that fails

A minimal reproduce scenario using https://stackblitz.com allows us to quickly confirm a bug (or point out coding problem) as well as confirm that we are fixing the right problem. If stackblitz is not a suitable way to demonstrate the problem (for example for issues related to our npm packaging), please create a standalone git repository demonstrating the problem.

We will be insisting on a minimal reproduce scenario in order to save maintainers time and ultimately be able to fix more bugs. Interestingly, from our experience users often find coding problems themselves while preparing a minimal stackblitz. We understand that sometimes it might be hard to extract essentials bits of code from a larger code-base but we really need to isolate the problem before we can fix it.

Unfortunately we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you we are going to close an issue that don't have enough info to be reproduced.

You can file new issues by filling out our [new issue form](https://github.com/ethan-far/ngx-window/issues/new).

### <a name="submit-pr"></a> Submitting a Pull Request (PR)
Before you submit your Pull Request (PR) consider the following guidelines:

### Development

1. Run `npm ci` to install the locked dependencies.
2. Run `npm run start` to try the demo application.
3. Add or update colocated unit tests for the public behavior being changed.
4. Run the same validation as CI: `npm run build`, `npm run build:lib`, and `npm run test:coverage`. All must pass. The coverage check requires at least 95% for statements, branches, functions, and lines. Append `-- --runInBand` to the test command when a single Jest process is needed.
5. Update the documentation listed below and inspect the demo in a browser.
6. Commit and push your changes to a feature branch.
7. Open a PR against `main`, link the original issue when one exists, and include the validation commands and their results.
8. Wait for review before merging.

### Documentation checklist

- Document new public APIs, return types, errors, and usage examples in the root `README.md`.
- Run `npm run sync:readme` to copy the root README into `projects/ngx-window/README.md`. The library build runs this step automatically; keep both copies identical in the PR.
- Add user-facing changes to the `Unreleased` section of `CHANGELOG.md` while work is in progress. For a change intended for publication, include its version bump in the PR: update the root and library `package.json`, both root version fields in `package-lock.json`, the README compatibility table, and a dated changelog entry together.
- Before publishing, verify that `npm run build:lib` produces the intended version in `dist/ngx-window/package.json` and inspect the package with `npm pack ./dist/ngx-window --dry-run`.
- Add or update the relevant demo. When its visible UI changes, refresh the corresponding PNG in `docs/screenshots` and verify that README image links still point to the right files.
- For viewport-dependent changes, check desktop, portrait, and short landscape layouts. Include cases where the primary placement fits, a fallback fits, and no configured placement fits.

For `getBestFit()` changes, also check that measuring a closed window leaves it closed, temporary content is removed, an already open window retains its content, and pending checks cancel on close or destroy.

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All code must follow the [Coding Guidelines][coding]
* All features or bug fixes **must be tested** by one or more specs (unit-tests) that follow the [Testing Guidelines][testing]
* All public API methods **must be documented**.
* Document your changes in the README (try to follow the convention you see in the rest of the file)
* Create an example in the demo application that demonstrates your changes so people can see how your changes work


[coc]: CODE_OF_CONDUCT.md
[coding]: CODING_GUIDELINES.md
[testing]: TESTING_GUIDELINES.md
[github]: https://github.com/ethan-far/ngx-window