# Releasing the Web Design System

This is our official process for releasing new versions of the [NASA Web Design
System](https://nasa.github.io/nasawds-site).


## Table of contents
1. [Principles](#principles)
1. [Versioning](#versioning)
    1. [What is a release?](#what-is-a-release)
    1. [The public API](#the-public-api)
1. [Release process](#release-process)
    1. [Git(/Hub) workflow](#git-workflow)
    1. [Pre-releases](#pre-releases)
1. [Questions?](#questions)


## Principles
1. Follow well-established [versioning practices](#versioning)
1. Provide detailed notes for each [release](#what-is-a-release)
1. Encourage contributions and thank contributors for their hard work


## Versioning
[Semantic versioning][semver] is a method of numbering release versions that
aims to help users understand the implications of upgrading from one
[release](#what-is-a-release) to another. Semantic version numbers take the
form `major.minor.patch`, where:

* Bug fixes increment the `patch` number (e.g. `1.0.0` to `1.0.1`)
* New features increment the `minor` number and reset `patch` (e.g. `1.0.1` to
  `1.1.0`)
* Changes to the [public API](#public-api) (breaking changes) increment the
  `major` version and reset `minor` and `patch` (e.g. `1.1.2` to `2.0.0`)

### What is a release?
Technically, release of the Web Design System core code "lives" in two
different places:

1. On GitHub as a [tag][git tag] and corresponding [release][releases]
1. On [npm][what is npm] as a release of the [`nasawds` package][nasawds on npm] with the same version number as the GitHub release

### The public API
In most software projects, the "public API" corresponds to a single set of
programming constructs, such as public classes or functions.  Because the
Design System consist of tightly-bound HTML, CSS, and JavaScript, we must consider
any "breaking" change to _any_ of these as a change to the public API. For
example, any of the following should trigger a major version increment:

* Changing the name of any `.usa-` class name (documented or not)
* Changing the way in which elements with `.usa-` class names are structured in
  HTML
* Changing the HTML "API" for any of our interactive components, such as the
  [accordion](https://nasa.github.io/nasawds-site/accordions/)


## Release process

### Git workflow

* We want to keep nasawds and nasawds-site up-to-date with [uswds](https://github.com/uswds/uswds) and [uswds-site](https://github.com/uswds/uswds-site) changes: 

    * Create a new remote in nasawds `git remote add upstream https://github.com/uswds/uswds.git` that points to uswds so we can pull in changes.
    * Create a new remote in nasawds-site `git remote add upstream https://github.com/uswds/uswds-site.git` that points to uswds-site so we can pull in changes.

* We have two main branches that are never deleted:

    * `master` always points to the latest release
    * `develop` contains changes being prepped for a release

* When introducing a change (feature, bug fix, etc.):

    1. Branch off `develop`:

        ```sh
        git fetch origin
        git checkout -b feature-foo origin/develop
        ```

    1. Name your branch pretty much anything except `master`, `develop`, or
       with the `release-` or `hotfix-` prefix. Suggested prefixes include
       `refactor-`, `feature-`, `docs-`, and `patch-`.

    1. If there are changes to uswds (or uswds-site) that haven't been merged into `develop` yet, it is recommended to pull/merge `upstream/master` into your branch.

    1. File your pull request to merge into the `develop` branch.

### Publishing a new release

⚠️ In these docs, `{{ version }}` should always be replaced with the semantic version number, i.e. `1.2.1` ⚠️

#### Create the release branch

- [ ] Determine if the version is a **patch** (`#.#.#`), **minor** (`#.#.0`), or **major** (`#.0.0`) version
- [ ] Branch off develop and use the branch name format `release-{{ version }}`.
```
git pull origin
git checkout -b release-{{ version }} origin/develop
```

- [ ] **If there's been further work on `develop` since branching,** merge the most recent `develop` into the version branch.

- - -

#### Prerelease if necessary
When releasing potentially disruptive changes, it's good practice to publish pre-releases of planned versions. These are sometimes also called release candidates. Here's how it works:

- [ ] Create a new branch from the release branch (`release-{{ version }}`) with `-pre` as an additional pre-release identifier, i.e. `release-{{ version }-pre`.

Follow the release process for your pre-release branch, with the following modifications:

- [ ] Publish to `npm` with a `dist-tag`
``
npm version {{ version }}-pre
npm publish --tag dev
``
- [ ] Mark the GitHub release as a "pre-release"
- [ ] Be sure to note how long you intend on waiting for show-stopping bug reports before proceeding with the release.
- [ ] Include instructions for installing the pre-release from `npm` with the `dist-tag`, e.g.:
``
npm install --save nasawds@dev
``
- [ ] Directly notify users who may be impacted by the proposed changes, and encourage them to alert us of any new issues within the prescribed testing period.

If you receive reports of any regressions (specifically, new issues introduced in the release), you can decide whether to address them in another pre-release or file them for the next official release. If you decide to move proceed with the release, it's good practice to alert users of the issue in your release notes, preferably with a :warning: emoji or similar.

Otherwise, proceed with the next versioned release!

- - -

#### Version the release with `npm`
`npm version` will increment the version number semantically in `package.json` and commit the changes to git. Versions will be tagged on the master branch.
- [ ] **For prerelease releases:** Run `npm --no-git-tag-version version prerelease`.
- [ ] **For patch releases:** Run `npm --no-git-tag-version version patch`.
- [ ] **For minor releases:** Run `npm --no-git-tag-version version minor`.
- [ ] **For major releases:** Run `npm --no-git-tag-version version major`.

- - -

#### Merge the release into `master`

- [ ] Push the version branch up to Github. If you are using SourceTree make sure that "push tags" is not selected.
- [ ] Open a pull request from your release branch into `master`.
- [ ] List the key changes in the release in the pull request description. [See the v1.5.0 pull request](https://github.com/uswds/uswds/pull/2369) for an example.
- [ ] Wait for all tests to complete successfully.
- [ ] Have at least one team member to approved the pull request
- [ ] Once the pull request is approved, merge it into `master`. This will trigger the following action:
- CircleCI will publish the new release to [npm](https://www.npmjs.com/package/nasawds).

- - -

#### Check that the release was successful
- [ ] Check the [CircleCI process](https://circleci.com/gh/nasa/nasawds)
- [ ] Check [nasawds on npm](https://www.npmjs.com/package/nasawds)

- - -

#### Create the binary, tag, and create the release in Github

- [ ] Close all running NASAWDS processes in the terminal
- [ ] In the `master` branch run `npm run prepublish` to build the assets zip file. It will be created at `dist/nasawds-{{ version }}.zip`.
- [ ] In [Github releases](https://github.com/nasa/nasawds/releases) select `Draft a new release`
- [ ] `tag`: `v{{ version }}`
- [ ] `target`: `master`
- [ ] Add release notes to the body. Use previous release notes as a starting point. https://github.com/nasa/nasawds/releases/edit/v1.4.6
- [ ] Have at least one team member review the release notes.
- [ ] Attach the `zip` binary you just created
- [ ] Select `Publish release`

- - -

#### Update the site repo with the new version number on a new branch

- [ ] Open the`nasawds-site` repo
```
cd path/to/nasawds-site
```
- [ ] Create a branch off `develop`
```
git fetch origin
git checkout -b release-{{ version }} origin/develop
```
- [ ] Change the nasawds dependency in `package.json` to the new version from `npm`
```
npm install --save-exact nasawds@{{ version }}
```
- [ ] Commit this change to the release branch

- - -

#### Merge site changes into the site repo's `master` branch

- [ ] Push the release branch to Github
- [ ] Open a pull request from your release branch into `master`.
- [ ] List the key changes in the release in the pull request description.
- [ ] Have at least one team member to approved the pull request
- [ ] Once the pull request is approved, merge it into `master`. This will trigger CircleCI to rebuild and redeploy the production site.

- - -

#### Check the NASAWDS website to assure correctness
- [ ] Check that the `Download code` ZIP file linked from the [Download code and design files](https://nasa.github.io/nasawds-site/getting-started/download/) page works (at the time of this writing, it should point to the ZIP file you uploaded when you released the new version on GitHub).
- [ ] Check that the correct version number is mentioned under the link.
- [ ] Check that the new release shows up on the [Release notes](https://nasa.github.io/nasawds-site/whats-new/releases/) page.

- - -

[draft release]: https://github.com/nasa/nasawds/releases/new
[git tag]: https://git-scm.com/book/en/v2/Git-Basics-Tagging
[new release]: https://github.com/nasa/nasawds/releases/new
[npm version]: https://docs.npmjs.com/cli/version
[pull request]: https://github.com/nasa/nasawds/compare
[releases]: https://github.com/nasa/nasawds/releases
[semver]: http://semver.org/
[uswds on npm]: https://npmjs.com/package/uswds
[what is npm]: https://docs.npmjs.com/getting-started/what-is-npm
[Slack]: https://slack.com/
[release candidates]: https://en.wikipedia.org/wiki/Software_release_life_cycle#Release_candidate
[components.designsystem.digital.gov]: https://components.designsystem.digital.gov/
