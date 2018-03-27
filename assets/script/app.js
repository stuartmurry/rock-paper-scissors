$(document).ready(function() {
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

  function RockPaperScissors(database) {
    return {
      database: database,
      displayName: "<Not Set>",
      email: "<Not Set>",
      players: {},
      selectedPlayerId : null,
      insertChat : function(key, val) {
        $('#ChatArea').append(val.Sender + ' : ' + val.Message + ' <br>');
      },

      insert: function(key, val) {
        this.players[key] = val;
        if (val.DisplayName == this.displayName) {
          // $('#list-tab').append(`
          // <div class="list-group-item list-group-item-action active"  href="javascript:void(0)" role="tab" aria-controls="home">
          //   ` + val.DisplayName + `
          // </div>
          // `);
        } else {
          $("#list-tab").append(
            `
          <a class="list-group-item list-group-item-action" id="` +
              key +
              `"  href="javascript:void(0)" role="tab" aria-controls="home">
            ` +
              val.DisplayName +
              `
          </a>
          `
          );
          var _this = this;
          $("#" + key).on("click", function(evt) {
            $('.play').removeClass('hidden');
            $(this).addClass('active');
            _this.selectedPlayerId = key;
            console.log(_this);
          });
        }
      },

      logout: function() {},
      updateUI: function() {
        console.log("updating UI");
        console.log(this.email);
        $("#displayName").html(this.displayName);
      }
    };
  }

  // global scope rps
  rps = new RockPaperScissors(firebase.database());

  $("#logout").on("click", function(evt) {
    firebase.auth().signOut();
  });

  $("#Send").on("click", function(evt) {
    firebase.database().ref("chat").push({ Sender: rps.displayName, Message : $("#Message").val() });
  });

  firebase.auth().onAuthStateChanged(function(user) {
    console.log(user);
    if (user) {
      // User is signed in.
      if (!user.displayName) {
        rps.displayName = user.email.split("@")[0];
      }

      rps.email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      firebase
        .database()
        .ref("players/" + uid)
        .once("value", function(snapshot) {
          const email = snapshot.val();
          console.log(email);
          if (!email) {
            console.log("creating new record");
            firebase
              .database()
              .ref("players/" + uid)
              .set({
                DisplayName: rps.displayName
              });
          }
        });

      firebase
        .database()
        .ref("players")
        .on("child_added", function(snapshot) {
          console.log("updating table");
          console.log(snapshot.key);
          console.log(snapshot.val());

          rps.insert(snapshot.key, snapshot.val());
        });

      firebase
        .database()
        .ref("chat")
        .on("child_added", function(snapshot) {
          rps.insertChat(snapshot.key, snapshot.val());
        });

      rps.updateUI();
    } else {
      window.location = "login.html";
    }
  });

  console.log("App Initialized");
});
