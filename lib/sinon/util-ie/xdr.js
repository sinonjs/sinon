/**
 * Helps IE run the fake XDomainRequest. By defining global functions, IE allows
 * them to be overwritten at a later point. If these are not defined like
 * this, overwriting them will result in anything from an exception to browser
 * crash.
 *
 * If you don't require fake XDR to work in IE, don't include this file.
 */
/*eslint-disable no-func-assign, strict*/
function XDomainRequest() {} // eslint-disable-line no-unused-vars, no-inner-declarations

// Reassign the original function. Now its writable attribute
// should be true. Hackish, I know, but it works.
/*global sinon*/
XDomainRequest = sinon.xdr.XDomainRequest || undefined;
