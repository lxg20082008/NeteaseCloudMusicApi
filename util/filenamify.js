'use strict'
const path = require('path')

const escapeStringRegexp = (string) => {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}

const trimRepeated = (string, target) => {
  if (typeof string !== 'string' || typeof target !== 'string') {
    throw new TypeError('Expected a string')
  }

  const regex = new RegExp(`(?:${escapeStringRegexp(target)}){2,}`, 'g')

  return string.replace(regex, target)
}

const filenameReservedRegex = () => {
  return /[<>:"/\\|?*\u0000-\u001F]/g
}
const windowsReservedNameRegex = () => {
  return /^(con|prn|aux|nul|com\d|lpt\d)$/i
}

const stripOuter = (string, substring) => {
  if (typeof string !== 'string' || typeof substring !== 'string') {
    throw new TypeError('Expected a string')
  }

  if (string.startsWith(substring)) {
    string = string.slice(substring.length)
  }

  if (string.endsWith(substring)) {
    string = string.slice(0, -substring.length)
  }

  return string
}

// Doesn't make sense to have longer filenames
const MAX_FILENAME_LENGTH = 100

const reControlChars = /[\u0000-\u001f\u0080-\u009f]/g // eslint-disable-line no-control-regex
const reRelativePath = /^\.+/

const filenamify = (string, options = {}) => {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  const replacement =
    options.replacement === undefined ? '!' : options.replacement

  if (
    filenameReservedRegex().test(replacement) &&
    reControlChars.test(replacement)
  ) {
    throw new Error(
      'Replacement string cannot contain reserved filename characters',
    )
  }

  string = string.replace(filenameReservedRegex(), replacement)
  string = string.replace(reControlChars, replacement)
  string = string.replace(reRelativePath, replacement)

  if (replacement.length > 0) {
    string = trimRepeated(string, replacement)
    string = string.length > 1 ? stripOuter(string, replacement) : string
  }

  string = windowsReservedNameRegex().test(string)
    ? string + replacement
    : string
  string = string.slice(0, MAX_FILENAME_LENGTH)

  return string
}

filenamify.path = (filePath, options) => {
  filePath = path.resolve(filePath)
  return path.join(
    path.dirname(filePath),
    filenamify(path.basename(filePath), options),
  )
}

module.exports = filenamify
