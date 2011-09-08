/*globals $:true, console: true */

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


(function() {
  "use strict";

  function getCertificate(pubkey, callback) {
    // Do something sly with the server to get a certificate
    $.ajax({
      type: 'post',
      url: '/api/generate_cert',
      data: {
        pubkey: pubkey
      },
      success: function(data, status, xhr) {
        if (callback) {
          var certificate = data.certificate;
          var updateURL = data.update_url;
          callback(certificate, updateURL);
        }
      },
      error: function() {

      }
    });
  }


  var email = navigator.id.username;
  if (email) {
    // First, register the verified email which gets a public key.
    navigator.id.checkVerifiedEmail(email, function(exists) {
      if (!exists) {
        navigator.id.generateKey(function(pubkey) {

          // secondly, get a certificate for the public key
          getCertificate(pubkey, function(certificate, updateURL) {
            console.log("certificate: " + certificate);
            console.log("updateURL: " + updateURL);

            // thirdly, register the certificate
            navigator.id.registerVerifiedEmailCertificate(certificate, updateURL, 
              function() {
                // all done
              });
          });
        });
      }
    });
  }

  // Listen for the logout message for w3c browsers. 
  if (document.addEventListener) {
    document.addEventListener("logout", function() {
      document.location = '/sign_out'; 
    }, false);
  }


}());

