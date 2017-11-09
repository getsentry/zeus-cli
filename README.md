<p align="center">
    <img src="https://user-images.githubusercontent.com/1433023/32624723-f1c8ec84-c53e-11e7-9e78-e5a6369176c3.png">
</p>

<h1>Zeus Command Line Interface</h1>

The official command line utility for [Zeus](https://github.com/getsentry/zeus).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Upload](#upload)

## Installation

The CLI comes as NPM package and can be installed via npm or yarn:


```bash
npm install -g zeus-ci
yarn add -g zeus-ci
```

## Usage

```
zeus-ci <command>

Commands:
  src upload <file> [type]  Upload a build artifact                 [aliases: u]

Options:
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

### Upload

This uploads a build artifact for processing or storage.

```
zeus-ci upload <file>

Positionals:
  file  Path to the artifact                                 [string] [required]

Options:
  -t, --type     Mime type of the file to upload                        [string]
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```
