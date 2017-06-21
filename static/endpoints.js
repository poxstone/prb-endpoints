
/** CONFIG */
    // id and scopes
    const CLIENT_ID = '448548789014-su3rs3853if9vabnpuinr6d4nmku2log.apps.googleusercontent.com';
    const SCOPES = 'https://www.googleapis.com/auth/userinfo.email';
    const APIROOT = 'endpoint2-dot-efor-gae-temp-01.appspot.com';
    const APILOCAL = 'localhost:8080';
    const EXTAPI = false; // true force to load APIROOT from local
    
    // Whether or not the user is signed in.
    var apiHello = apiHello || {};
    apiHello.signedIn = false;


/** LOGING */
    // Handles the auth flow, with the given value for immediate mode.
    apiHello.signin = function(mode, callbackUserAuthed) {
      let authObj = { 'client_id': CLIENT_ID,
                      'scope':     SCOPES,
                      'immediate': mode };
      gapi.auth.authorize(authObj, callbackUserAuthed); //apiHello.userAuthed
    };
    
    // Loads the application UI after the user has completed auth.
    apiHello.userAuthed = function() {
      let request = gapi.client.oauth2.userinfo.get().execute( respiUserAuth => {
          if (!respiUserAuth.code) {
            apiHello.signedIn = true;
            document.querySelector('#signinButton').textContent = 'Sign out';
          } else {
            alert('Press login button');
          }
      });
    };
    

/*** INIT ***/
    // Initializes the application. @param {string} apiRoot Root of the API's path.
    apiHello.init = function(apiRoot) {
      // Loads the OAuth and helloworld APIs asynchronously, and triggers login
      var apisToLoad;
      var callbackInint = function() {
        // 2 calls helloworld and oauth2
        if (--apisToLoad == 0) {
          enableButtons();
          apiHello.signin(true, apiHello.userAuthed);
        }
      }
    
      apisToLoad = 2; // must match number of calls to gapi.client.load()
      if (gapi.client && gapi.client.load) {
        gapi.client.load('helloworld', 'v1', callbackInint, apiRoot); // load api "helloworld" and version
        gapi.client.load('oauth2', 'v2', callbackInint);
      } else {
        setTimeout(()=>{
          apiHello.init(apiRoot);
        }, 250)
      }
    };
    
    // init with apis url in front
    function init() {
      let host = window.location.host.match(/localhost/) ? APILOCAL : APIROOT ;
      host = EXTAPI ? APIROOT : host;
      apiHello.init('//' + host + '/_ah/api');
    }
    

/** API METHODS */
    // Gets a numbered greeting via the API.  @param {string} id ID of the greeting.
    apiHello.getGreeting = function(id) {
      gapi.client.helloworld.greetings.getGreeting({'id': id}).execute( (resp) => {
        if (!resp.code) {
          print(resp.message);
        }
      });
    };
  
    // Lists greetings via the API.
    apiHello.listGreeting = function() {
      gapi.client.helloworld.greetings.listGreeting().execute( (resp) => {
          if (!resp.code) {
            var list = [];
            resp.items = resp.items || [];
            for (var i = 0; i < resp.items.length; i++) {
              list.push(resp.items[i].message);
            }
            print( list.join() );
          }
      });
    };
  
    // Gets a greeting a specified number of times.
    // @param {string} greeting Greeting to repeat.  @param {string} count Number of times to repeat it.
    apiHello.multiplyGreeting = function( greeting, times) {
      let messageOpt = { 'message': greeting, 'times': times };
      gapi.client.helloworld.greetings.multiply(messageOpt).execute( (resp) => {
        if (!resp.code) {
          print(resp.message);
        }
      });
    };
  
    // Greets the current user via the API.
    apiHello.authedGreeting = function(id) {
      gapi.client.helloworld.greetings.authed().execute( resp => {
        print(resp.message)
      });
    };




/** DOM manipulation NO API */

    // Enables the button callbacks in the UI.
     function enableButtons() {
      let getGreeting = document.querySelector('#getGreeting');
      getGreeting.addEventListener('click', (e) => {
        apiHello.getGreeting( document.querySelector('#id').value);
      });
    
      var listGreeting = document.querySelector('#listGreeting');
      listGreeting.addEventListener('click', apiHello.listGreeting);
    
      var multiplyGreetings = document.querySelector('#multiplyGreetings');
      multiplyGreetings.addEventListener('click', (e) => {
        apiHello.multiplyGreeting( document.querySelector('#greeting').value, document.querySelector('#count').value);
      });
    
      var authedGreeting = document.querySelector('#authedGreeting');
      authedGreeting.addEventListener('click', apiHello.authedGreeting );
    
      var signinButton = document.querySelector('#signinButton');
      signinButton.addEventListener('click', apiHello.auth);
    };

    // Prints a greeting to the greeting log. greeting{boject}
    function  print(greeting) {
      let element = document.createElement('li');
      element.innerHTML = greeting;
      document.querySelector('#outputLog').appendChild(element);
    };

    // Presents the user with the authorization popup.
    apiHello.auth = function() {
      if (!apiHello.signedIn) {
        apiHello.signin(false, apiHello.userAuthed);
      } else {
        apiHello.signedIn = false;
        document.querySelector('#signinButton').textContent = 'Sign in';
      }
    };

