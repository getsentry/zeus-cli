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
  * [Supported CI Systems](#supported-ci-systems)
  * [Uploading Artifacts](#uploading-artifacts)
  * [Bash Completion](#bash-completion)
* [Development](#development)

## Installation

The CLI comes as NPM package and can be installed via npm or yarn:

```bash
npm install -g @zeus-ci/cli
yarn add -g @zeus-ci/cli
```

## Usage

The CLI offers a set of commands to interact with the Zeus server. Besides
specific parameters and options for each command, there is a range of common
options:

```
zeus <command>

Commands:
  zeus upload <file>  Upload a build artifact                       [aliases: u]
  zeus completion     generate bash completion script

Options:
  --url          Fully qualified URL to the Zeus server                 [string]
  --token        Token for authorized access to Zeus                    [string]
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

The `--url` parameter defaults to `https://zeus.ci`. If you are running a
self-hosted version of Zeus, set this parameter to the fully qualified URL that
the server is listening to. The value can also be provided via the `ZEUS_URL`
environment variable. The command line option always takes precedence over the
environment.

Most commands require a token to authorize access. This can either be a personal
token obtained from the [Account Settings Page](https://zeus.ci/settings/token)
or a repository token obtained from the respective repository settings page. Use
the `--token` parameter or `ZEUS_TOKEN` environment variable to provide the
token.

The CLI also supports reading environment variables from a `.env` file located
in the current working directory. Note that command line parameters always
override the environment.

```sh
ZEUS_URL=https://zeus.ci
ZEUS_TOKEN=zeus-u-xxxxxxxx
```

### Supported CI Systems

In some environments, the CLI is able to infer parameters like build or job
numbers and commit hashes for you. In this case, you can omit the respective
paramters. These systems are:

* Travis CI
* AppVeyor

### Uploading Artifacts

Upload a build artifact for processing or storage. The artifact is attached to a
build and job. On supported CI systems, the build and job ids are automatically
inferred from the environment.

Optionally, you can specify a mime type to classify the artifact with `--type`.
This is used to hint Zeus how the artifact should be processed. By default, the
mime type is inferred from the file name.

**NOTE:** This command still uses the legacy `ZEUS_HOOK_BASE` environment
variable. This requires a hook to be configured in the repository settings. In
future versions, this will be replaced with the default authorization tokens.

```
zeus upload <file>

Positionals:
  file  Path to the artifact                                 [string] [required]

Options:
  --url          Fully qualified URL to the Zeus server                 [string]
  --token        Token for authorized access to Zeus                    [string]
  -t, --type     Mime type of the file to upload                        [string]
  -j, --job      Unique id of the job in CI                             [string]
  -b, --build    Unique id of the build in CI                           [string]
```

**Examples:**

```sh
# On a supported build server
zeus upload coverage.xml

# With explicit mime type
zeus upload -t 'text/xml+coverage' coverage.xml

# On a custom build server
zeus upload -b $MY_BUILD_ID -j $MY_JOB_ID -t 'text/xml+coverage' coverage.xml
```

### Bash Completion

Output a script to generate command line completion suggestions.

```sh
# Linux
zeus completion >> ~/.bashrc

# macOS
zeus completion >> ~/.bash_profile
```

## Development

```sh
# Install dependencies
yarn

# Run the bot
yarn start

# Run test watchers
yarn test:watch
```

We use [prettier](https://prettier.io/) for auto-formatting and
[eslint](https://eslint.org/) as linter. Both tools can automatically fix a lot
of issues for you. To invoke them, simply run:

```sh
yarn fix
```

It is highly recommended to use VSCode and install the suggested extensions.
They will configure your IDE to match the coding style, invoke auto formatters
every time you save and run tests in the background for you. No need to run the
watchers manually.
