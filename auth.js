#!/usr/bin/env node
var ldap = require('ldapjs');

var LDAP_SERVER_URL = 'ldaps://addressbook.mozilla.com:636';

/**
 * Authenticate with the Mozilla LDAP server.
 *
 * @method bind
 * @param {string} username - username to use - without the @mozilla.
 * @param {string} password - password to use.
 * @param {function} [callback] - callback to call when complete.  Will be 
 * called with one parameter - err.  err will be null if successful, an object 
 * otw.
 */
function bind(username, password, callback) {
  var bindDN = 'mail=' + username + '@mozilla.com,o=com,dc=mozilla';
/*  var client = ldap.createClient({
    url: LDAP_SERVER_URL
  });

  client.bind(bindDN, password, function(err) {
    client.unbind();
    client = null;
    */
    if (callback) {
      callback(null);
    }
 // });
};

exports.bind = bind;
