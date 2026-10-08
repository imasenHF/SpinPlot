import assert from 'node:assert/strict';
import {tickFormatter} from './ticks.js';
const time=tickFormatter([0,.002,.004,.006,.008]);assert.equal(time.exponent,-3);assert.equal(time.multiplier,'×10⁻³');assert.deepEqual([0,.002,.004,.006,.008].map(time.format),['0','2','4','6','8']);
const field=tickFormatter([3000,3050,3100]);assert.equal(field.exponent,0);assert.equal(field.format(3050),'3050');
const narrow=tickFormatter([3000,3000.01,3000.02]);assert.equal(new Set([3000,3000.01,3000.02].map(narrow.format)).size,3);
const manual=tickFormatter([1.23456,2.34567],{digits:3});assert.equal(manual.format(1.23456),'1.23');assert.equal(manual.format(-0),'0');
const decimal=tickFormatter([0,.002,.008],{notation:'decimal'});assert.equal(decimal.exponent,0);assert.equal(decimal.format(.008),'0.008');
assert.equal(tickFormatter([1e6,2e6]).exponent,6);assert.equal(tickFormatter([3000,4000],{notation:'scientific'}).exponent,3);assert.equal(tickFormatter([0,0]).format(0),'0');assert.equal(tickFormatter([.1,.2,.3]).format(.30000000000000004),'0.3');console.log('Axis formatting: small time values, scientific exponents, manual precision, narrow field windows, zero and floating-point tails passed');
