
var database = null;
var player1Info = {};
var player2Info = {};

$(document).ready(function() {
	// a variable to reference the database.
	database = initializeFirebase();
	nameSubmissionListener();
	deleteDatabaseInfo();
	// database.ref().child("players").set({1:{"choice": "Rock", "losses": 2, "wins": 1, "name": "Pavan"}});
	// 	database.ref().on("value", function(snapshot) {
	// 	// We are now inside our .on function...

	// 	// Console.log the "snapshot" value (a point-in-time representation of the database)
	// 	// console.log("snapshot.val(): " + snapshot.val());

	// 	// This "snapshot" allows the page to get the most current values in firebase.

	// 	// Update the value of our trainInfoArray to match the info in the database
	// 	// if (snapshot.val()) {
	// 		console.log(snapshot.val()); // null if there is no child node
	// 		console.log(snapshot.val().players);
	// 	// }
	// });
});

function initializeFirebase() {
	var config = {
	    apiKey: "AIzaSyAgjUBM3fOv-hkXyp3PVO37jc7QKXtmKZ4",
	    authDomain: "rps-multiplayer-93433.firebaseapp.com",
	    databaseURL: "https://rps-multiplayer-93433.firebaseio.com",
	    projectId: "rps-multiplayer-93433",
	    storageBucket: "rps-multiplayer-93433.appspot.com",
	    messagingSenderId: "1015323759135"
	};
	firebase.initializeApp(config);
	return firebase.database();
}

function deleteDatabaseInfo() {
    $("#reset-database-button").on("click", function() {
		database.ref().child("players").remove();
	});
}
function nameSubmissionListener() {
	$("#name-submit-button").on("click", function(event) {
		event.preventDefault();

		var nameInputfieldId = $("#inlineFormInput");
		var name = nameInputfieldId.val();
		database.ref().once("value", function(snapshot) {
			if (!snapshot.val()) {
				player1Info = {"name": name, "choice": "", "wins": 0, "losses": 0};
				database.ref().child("players/1").set(player1Info);
				displayPlayerInfo("#player1-div", player1Info);	
			} else {
				player2Info = {"name": name, "choice": "", "wins": 0, "losses": 0};
				database.ref().child("players/2").set(player2Info);
				displayPlayerInfo("#player2-div", player2Info);
			}
			clearInputField(nameInputfieldId);
		});
	});
}

function clearInputField(fieldId) {
	$(fieldId).val("");
}

function displayPlayerInfo(playerDivId, playerInfo) {
	$(playerDivId).text("");

	var playerNameDiv = $("div");
	playerNameDiv.addClass("row");
	playerNameDiv.html("<div class=\"col-md-12\">" + playerInfo["name"] + "</div>");
	$(playerDivId).append(playerNameDiv);

	$(playerDivId).append(generateRockPaperScissorsButtons("Rock"));
	$(playerDivId).append(generateRockPaperScissorsButtons("Paper"));
	$(playerDivId).append(generateRockPaperScissorsButtons("Scissors"));

	var playerWinLossDiv = $("div");
	playerWinLossDiv.addClass("row");
	playerWinLossDiv.html("<div class=\"col-md-12\">Wins: " + playerInfo["wins"] + " Losses: " + playerInfo["losses"] + "</div>");
	$(playerDivId).append(playerWinLossDiv);

}

function generateRockPaperScissorsButtons(buttonText) {
	var buttonTextDiv = $("div");
	buttonTextDiv.addClass("row");
	buttonTextDiv.html("<div class=\"col-md-12 btn\">" + buttonText + "</div>");
	return buttonTextDiv;
}

