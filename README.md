<div align="center">
    <img src="https://user-images.githubusercontent.com/1433023/32624723-f1c8ec84-c53e-11e7-9e78-e5a6369176c3.png">
    <h1>Zeus CLI</h1>
</div>

The command line utility for [Zeus](https://github.com/getsentry/zeus).

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

This uploads build artifacts to Zeus for processing or storage.


```
Positionals:
  file  Path to the artifact                                 [string] [required]
  type  Mime type of the file to upload                                 [string]

Options:
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```
