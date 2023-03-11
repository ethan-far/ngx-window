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

1. run `npm install`
2. run `npm run start`
3. write tests & code in TS
4. run `npm run test:coverage` which will ensure that you meet the required code coverage
5. commit your changes
6. push your changes
7. create a PR with a link to the original issue
8. wait till approved

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more specs (unit-tests).
* All public API methods **must be documented**.
* Document your changes in the README (try to follow the convention you see in the rest of the file)
* Create an example in the demo application that demonstrates your changes so people can see how your changes work


[coc]: https://github.com/ethan-far/ngx-window/CODE_OF_CONDUCT.md
[github]: https://github.com/ethan-far/ngx-window