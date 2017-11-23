<p align="center">
    <img src="https://user-images.githubusercontent.com/1433023/32629198-3c6f225e-c54d-11e7-96db-99fd22709a1b.png" width="271">
</p>

<h1>Zeus Command Line Interface</h1>

[![Travis](https://img.shields.io/travis/getsentry/zeus-cli.svg)](https://travis-ci.org/getsentry/zeus-cli)
[![GitHub release](https://img.shields.io/github/release/getsentry/zeus-cli.svg)](https://github.com/getsentry/zeus-cli/releases/latest)
[![npm version](https://img.shields.io/npm/v/@zeus-ci/cli.svg)](https://www.npmjs.com/package/@zeus-ci/cli)
[![license](https://img.shields.io/github/license/getsentry/zeus-cli.svg)](https://github.com/getsentry/zeus-cli/blob/master/LICENSE)

The official command line utility for [Zeus](https://github.com/getsentry/zeus).

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
  * [Upload](#upload)
  * [Bash Completion](#bash-completion)

## Installation

The CLI comes as NPM package and can be installed via npm or yarn:

```bash
npm install -g @zeus-ci/cli
yarn add -g @zeus-ci/cli
```

## Usage

```
zeus <command>

Commands:
  zeus upload <file>  Upload a build artifact                        [aliases: u]
  zeus completion     generate bash completion script

Options:
  --url          Fully qualified URL to the Zeus server                 [string]
  --token        Token for authorized access to Zeus                    [string]
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

### Upload

This uploads a build artifact for processing or storage. The artifact is
attached to a build and job. On supported CI systems, the build and job ids are
automatically inferred from the environment.

```
zeus upload <file>

Positionals:
  file  Path to the artifact                                 [string] [required]

Options:
  -t, --type     Mime type of the file to upload                        [string]
  -j, --job      Unique id of the job in CI                             [string]
  -b, --build    Unique id of the build in CI                           [string]
```

### Bash Completion

Output a script to generate command line completion suggestions.

```sh
# Linux
zeus completion >> ~/.bashrc

# macOS
zeus completion >> ~/.bash_profile
```
