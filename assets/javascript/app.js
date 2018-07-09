
var database = null;
var player1Info = {};
var player2Info = {};
var chat = [];

$(document).ready(function() {
	// a variable to reference the database.
	database = initializeFirebase();
	nameSubmissionListener();
	deleteDatabaseInfo();
	getPlayer1Info();
	getPlayer2Info();
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
	// getPlayer1Info();
	// getPlayer2Info();
}

function deletePlayerInfo(playerNumber) {
    $("#reset-database-button").on("click", function() {
		database.ref().child("players" + "/" + playerNumber).remove();
	});
}
function nameSubmissionListener() {
	$("#name-submit-button").on("click", function(event) {
		event.preventDefault();

		var nameInputfieldId = $("#inlineFormInput");
		var nameInputfieldValue = nameInputfieldId.val();
		var name = nameInputfieldValue.charAt(0).toUpperCase() + nameInputfieldValue.slice(1);
		database.ref().once("value", function(snapshot) {
			if (!snapshot.val()) {
				player1Info = {"name": name, "choice": "", "wins": 0, "losses": 0};
				setPlayer1Info();
				getPlayer1Info();
				displayPlayerInfo("#player1-div", player1Info);	
			} else {
				player2Info = {"name": name, "choice": "", "wins": 0, "losses": 0};
				setPlayer2Info();
				getPlayer2Info();
				displayPlayerInfo("#player2-div", player2Info);
			}
			clearInputField(nameInputfieldId);
		});
	});
}

function getPlayer1Info() {
	database.ref().on("value", function(snapshot) {
		console.log("inside getPlayer1Info()");
		if (snapshot.val() && snapshot.val()["players"] && snapshot.val()["players"][1]) {
			player1Info = snapshot.val()["players"][1];
			displayPlayerInfo("#player1-div", player1Info);
		} else {
			displayInDiv("#player1-div", "Waiting for Player 1");
		}
	});
}

function setPlayer1Info() {
	database.ref().child("players/1").set(player1Info);
}

function getPlayer2Info() {
	database.ref().on("value", function(snapshot) {
		console.log("inside getPlayer2Info()");
		if (snapshot.val() && snapshot.val()["players"] && snapshot.val()["players"][2]) {
			player2Info = snapshot.val()["players"][2];
			displayPlayerInfo("#player2-div", player2Info);
		} else {
			displayInDiv("#player2-div", "Waiting for Player 2");
		}
	});
}

function setPlayer2Info() {
	database.ref().child("players/2").set(player2Info);
}

function getChatMessages() {
	database.ref().once("value", function(snapshot) {
		if (!snapshot.val() && !snapshot.val()["chat"]) {
			chat = snapshot.val()["chat"];
		}
	});
}
function setChatMessages() {
	database.ref().child("chat").set(chat);
}

function clearInputField(fieldId) {
	$(fieldId).val("");
}

function displayInDiv(divId, text) {
	$(divId).text(text);
}

function displayPlayerInfo(playerDivId, playerInfo) {
	$(playerDivId).text("");

	$(playerDivId).append("<div class=\"d-block btn-success border rounded m-3\">" + playerInfo["name"] + "</div>");

	var rpsInfoDiv = $("<div>");
	rpsInfoDiv.addClass("rpsInfo");
	$(rpsInfoDiv).append(generateRockPaperScissorsButtons("Rock"));
	$(rpsInfoDiv).append(generateRockPaperScissorsButtons("Paper"));
	$(rpsInfoDiv).append(generateRockPaperScissorsButtons("Scissors"));
	$(playerDivId).append(rpsInfoDiv);

	$(playerDivId).append(generatePlayerStatsDiv(playerInfo));
}

function generateRockPaperScissorsButtons(buttonText) {
	return "<div class=\"d-block btn btn-warning m-1\">" + buttonText + "</div>";
}

function generatePlayerStatsDiv(playerInfo) {
	return "<div class=\"d-block btn-info border rounded m-3\">Wins: " + playerInfo["wins"] + " Losses: " + playerInfo["losses"] + "</div>";
}

