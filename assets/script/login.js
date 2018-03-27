$(document).ready(function() {
  function Login(database) {
    return {
      database: database,
      login: function() {
        firebase
          .auth()
          .signInWithEmailAndPassword($("#email").val(), $("#password").val())
          .then(data => {
            console.log(data);
          })
          .catch(function(error) {
            if (error.code == "auth/user-not-found") {
              alert("User Not Found.");
            }
            console.log(error);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            alert(errorMessage);
          });
      },
      register: function() {
        firebase
          .auth()
          .createUserWithEmailAndPassword($("#email").val(), $("#password").val())
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            alert(errorMessage);
          });
      },
      forgot: function() {
        firebase
        .auth()
        .sendPasswordResetEmail($("#email").val())
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...

          alert(errorMessage);
        });
      }
    };
  }

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCfSs47hvd3k5Qk-iXlDrnmYFnhN1g3-vQ",
    authDomain: "rockpaperscissors-8f3d1.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-8f3d1.firebaseio.com",
    projectId: "rockpaperscissors-8f3d1",
    storageBucket: "rockpaperscissors-8f3d1.appspot.com",
    messagingSenderId: "6089996899"
  };

  firebase.initializeApp(config);

  var login = new Login(firebase.database());

  $("#Login").on("click", function() {
    login.login();
  });

  $("#Register").on("click", function() {
    login.register();
  });

  $("#ForgotPassword").on("click", function() {
    login.forgot();
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      window.location = "index.html";
      // ...
    } else {
      // User is signed out.
      // ...
    }
  });
});
