
/** CONFIG */
const CLIENT_ID = '448548789014-su3rs3853if9vabnpuinr6d4nmku2log.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/userinfo.email';
//const APIROOT = 'endpoint2-dot-efor-gae-temp-01.appspot.com';
const APIROOT = '8080-dot-2975244-dot-devshell.appspot.com';
const APILOCAL = 'localhost:8080';
const EXTAPI = false; // true force to load APIROOT from local

// Whether or not the user is signed in.
var apiHello = apiHello || {
  signedIn : false,
  signin : function(mode, callbackUserAuthed) {
    let authObj = { 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': mode };
    gapi.auth.authorize(authObj, callbackUserAuthed);
  },
  userAuthed : function() {
    let request = gapi.client.oauth2.userinfo.get().execute( respiUserAuth => {
      console.log(respiUserAuth);
      if (!respiUserAuth.code) {
        apiHello.signedIn = true;
        document.querySelector('#signinButton').textContent = 'Sign out';
      } else {
        alert('Press login button');
      }
    });
  },
  init : function(apiRoot) {
    var apisToLoad;
    var callbackInint = function() {
      if (--apisToLoad == 0) {
        apiHello.signin(true, apiHello.userAuthed);
      }
    }

    apisToLoad = 2; 
    if (gapi.client && gapi.client.load) {
      gapi.client.load('helloworld', 'v1', callbackInint, apiRoot);
      gapi.client.load('oauth2', 'v2', callbackInint);
    } else {
      setTimeout( () => {
        apiHello.init(apiRoot);
      }, 250)
    }
  },
  auth : function() {
    if (!apiHello.signedIn) {
      apiHello.signin(false, apiHello.userAuthed);
    } else {
      apiHello.signedIn = false;
      document.querySelector('#signinButton').textContent = 'Sign in';
    }
  }
};

// init with apis url in front
function init() {
  let host = window.location.host.match(/localhost/) ? APILOCAL : APIROOT ;
  host = EXTAPI ? APIROOT : host;
  apiHello.init('//' + host + '/_ah/api');

  var signinButton = document.querySelector('#signinButton');
  signinButton.addEventListener('click', apiHello.auth);
}
