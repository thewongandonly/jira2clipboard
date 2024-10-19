# Jira Story to clipboard

When committing to git, simply use this chrome extension to copy current jira headline to clipboard.

This sample demonstrates how to use the [chrome.action](https://developer.chrome.com/docs/extensions/reference/api/action) API to execute code when the extension icon is clicked.

## Overview

This extension collects jira story on the active tab page for easy git commits.
PS: tab must have focus

## Running this extension

1. Clone this repository.
2. Load this directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
3. Navigate to (https://jira.vijzelmolen.nl/) page and click on either a board or story detail.
4. Click the extension icon.

## Firefox

Note: requires a developer edition, nightly or unbranded build of Firefox! Release build require a signed extension or only allows loading as a temporary extension (lost after restart).

1. Clone this repository
2. zip folder and rename zip extension to xpi
3. Open Firefox, go to about:config and change xpinstall.signatures.required to false
4. Go to Add-on and themes, click the cog and Install add-on from file...
