import type { Request, Response } from 'express';
import {} from 'npm';
import { maxSatisfying, valid } from 'semver';

export function findVersion(meta: Record<string, string>, tag: string) {
  // already a valid version?
  if (valid(tag)) {
    return meta.versions[tag] && tag;
  }

  // dist tag
  if (tag in meta['dist-tags']) {
    return meta['dist-tags'][tag];
  }

  // semver range
  return maxSatisfying(Object.keys(meta.versions), tag);
}

const reservedWords = 'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public'.split(
  ' ',
);
const builtins = 'Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl'.split(
  ' ',
);

const invalid = Object.create(null);
reservedWords.concat(builtins).forEach((word) => (invalid[word] = true));

export function makeLegalIdentifier(str: string) {
  str = str.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()).replace(/[^\w$]/g, '_');

  if (/\d/.test(str[0]) || invalid[str]) {
    str = `_${str}`;
  }

  return str;
}

/**
 * Sends a bad request response.
 */
export function sendBadRequest(res: Response, message: string) {
  res.status(400);
  res.end(message);
}

/**
 * Sends an error response.
 */
export function sendError(res: Response, message: string) {
  res.status(500);
  res.set('Content-Type', 'text/html');
  res.end(message);
}
