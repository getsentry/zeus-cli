# Changelog

## v0.4.3

* Fix invalid download URL after upload

## v0.4.2

* Support multiple files in one upload command

## v0.4.1

* Fix an issue that prevented artifact uploads
* Show full download URL after successful artifact upload
* Improve debug log output

## v0.4.0

* Node v4 is now fully supported
* Support `ZEUS_URL` and `ZEUS_TOKEN` environment variables
* Added `--url` and `--token` command line parameters
* Read environment variables from `.env` files in your working directory
* Improved URL handling and sanatizing (e.g. `ZEUS_HOOK_BASE`)
* Improved documentation for configuration and the upload command
* Improved error output and exit codes

## v0.3.3

* Require Node 4.5.0 or later
* Remove heavy polyfill dependencies

## v0.3.2

* Compatibility with NPM 2.x

## v0.3.1

* Compatibility with Node 0.12

## v0.3.0

* Rename package to `@zeus-ci/cli`
* Rename the command line utility to just `zeus`
* Deprecate the `zeus-ci` package

## v0.2.4

* Fix a regression in environment detection

## v0.2.3

* Compatibility with Node v6

## v0.2.2

* Fix a bug in environment detection

## v0.2.1

* Fix command line execution on Linux

## v0.2.0

* **Breaking**: Makes the `type` flag an option instead of parameter

## v0.1.0

Initial release.

* `upload` command to upload artifacts
* Automatically guess the environment (Travis or AppVeyor)
* Use `ZEUS_HOOK_BASE` environment variable to authenticate
