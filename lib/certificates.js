#!/usr/bin/env node

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla BrowserID.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var jwcert = require("./jwcrypto/jwcert"),
    keyPair = require("./issuer_key");

// Who the cert is originating from. AKA - who are we?
const ISSUER = "mozilla.com";

/**
 * Generates a certificate for the given email address
 * @method generateCertificate
 * @param {string} email - email address to generate certificate for
 * @param {function} callback - callback to call when complete - called with 
 * two parameters, the first err, will be null if no error, an object otw, the 
 * second has the certificate.
 */
function generateCertificate(email, pubkey, callback) {
  var tok = new jwcert.JWCert(ISSUER, new Date(), pubkey, {
    email: email
  });
  var cert = tok.sign(keyPair.secretKey);
  if (callback) {
    callback(null, cert);
  }
}

exports.generateCertificate = generateCertificate;
