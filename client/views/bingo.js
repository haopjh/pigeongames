Template.bingo.events({
	"click .game-start-btn": function(e, template) {
		// var username = template.$(".player-item.active").html().trim();
		if (Meteor.user()) {
			var bingo = {
				playerList: [Meteor.user().username]
			};

			Meteor.call('newBingo', bingo, function(err, bingoId) {
				console.log("success with id:", bingoId);
				Router.go("/bingo/"+bingoId)
			});

			Meteor.users.update(Meteor.user()._id, {
				$inc: {"profile.played": 1}
			});
		} else {
			$(".login-wrap").addClass("active");
			$(".login-btn").trigger("click");
		}
			
	},
	"click .remove-bingo-btn": function() {
		if (Meteor.user().username === "Junhao") {
			Bingo.remove(this._id);
		}
	},
	"click .delete-user": function(e) {
		if (Meteor.user().username === "Junhao") {
			Meteor.users.remove($(e.currentTarget).attr("data-id"));
		}
	}
});

Template.bingo.helpers({
	getBingos: function() {
		return Bingo.find({gameStatus: /new|ongoing/});
	},
	getGameCreator: function() {
		return this.playerList[0];
	},
	shortId: function() {
		return this._id.substring(0,4);
	}
});


Template.bingoGame.helpers({
	getUserNumberCard: function() {
		if (this.playerList && Meteor.user() && this.playerCards) {
			var index = this.playerList.indexOf(Meteor.user().username);
			return this.playerCards[index];
		}
	},

	getPlayerTurn: function() {
		if (this.playerList && Meteor.user()) {
			return this.playerList[this.playerTurn-1];
		}
	},
	isYourTurn: function() {
		return this.playerList.indexOf(Meteor.user().username) === this.playerTurn-1;
	},
	isNotInGame: function() {
		if (this.playerList && Meteor.user()) {
			return this.playerList.indexOf(Meteor.user().username) === -1;
		} else if (!Meteor.user()) {
			return true;
		} else {
			return false;
		}
	},
	checkedNumber: function() {
		var bingo = Bingo.findOne(Session.get("bingoId"));
		return bingo.chosenNumbers.indexOf(this.valueOf().toString()) > -1;
	},
	gameCompleted: function() {
		return this.gameStatus === "completed";
	},
	winnerIsYou: function() {
		if (Meteor.user()) {
			return this.winners.indexOf(Meteor.user().username) > -1;
		}
	},
	hasSufficientPlayers: function() {
		// return this.playerList.length > 1;
		return true;
	},
	linesFormed: function() {
		var index = this.playerList.indexOf(Meteor.user().username);
		var results = checkGameBoard(this.playerCards[index], this.chosenNumbers);
		console.log(results);
		return results.completed;
	}
});

Template.bingoGame.events({
	"click .bingo-number": function(e) {
		var bingo = Bingo.findOne(Session.get("bingoId"));
		if (bingo.gameStatus !== "completed" && bingo.playerList && 
			bingo.playerTurn === bingo.playerList.indexOf(Meteor.user().username)+1) {
			var number = $(e.currentTarget).attr("data-number");

			Bingo.update(Session.get("bingoId"), {
				$addToSet: {chosenNumbers: number}
			}, function() {
				var newBingo = Bingo.findOne(Session.get("bingoId"));
				var userIndex = newBingo.playerList.indexOf(Meteor.user().username);

				var someoneWon = true;
				for(var i=0; i<newBingo.playerList.length; i++) {

					var results = checkGameBoard(newBingo.playerCards[i], newBingo.chosenNumbers);

					if (results.completed < 5) {
						someoneWon = false;
					} else {
						Bingo.update(Session.get("bingoId"), {
							$set: {
								gameStatus: "completed"
							},
							$addToSet: {
								winners: newBingo.playerList[i]
							}
						});
						var user = Meteor.users.findOne({username: newBingo.playerList[i]});
						Meteor.users.update({_id: user._id}, {
							$inc: {"profile.wins": 1}
						});
					}
				}
				if (!someoneWon) {
					var nextPlayer = bingo.playerTurn < bingo.playerList.length ? bingo.playerTurn + 1 : 1;
					Bingo.update(Session.get("bingoId"), {
						$set: {
							playerTurn: nextPlayer
						}
					});
				}
			});
		} else if (bingo.gameStatus === "completed") {
			console.log("Game has ended");
		} else {
			console.log("not your turn");
		}
			
	},

	"click .join-game-btn": function() {
		Meteor.call("addPlayer", Session.get("bingoId"), 
			Meteor.user().username);
		Meteor.users.update(Meteor.user()._id, {
			$inc: {"profile.played": 1}
		});
	}
});

Template.bingoGame.rendered = function() {
	// if (Meteor.user()) {
	// 	var newBingo = Bingo.findOne(Session.get("bingoId"));
	// 	var userIndex = newBingo.playerList.indexOf(Meteor.user().username);
	// 	varresults = checkGameBoard(newBingo.playerCards[userIndex], newBingo.chosenNumbers);

	// 	if (results.completed >= 5 && newBingo.gameStatus !== "completed") {
	// 		Bingo.update(Session.get("bingoId"), {
	// 			$set: {
	// 				gameStatus: "completed",
	// 				$addToSet: {winners: Meteor.user().username}
	// 			}
	// 		});
	// 	}
	// }
		
}

var checkGameBoard = function(userCard, chosenNumbers) {
	//get matched card
	var matchedCard = [];
	userCard.forEach(function(number) {
		if(chosenNumbers.indexOf(number.toString()) > -1) {
			matchedCard.push(true);
		} else {
			matchedCard.push(false);
		}
	});

	// if (matchedCard.length === 36) {
	var matrixIndex = Math.sqrt(matchedCard.length);

	var results = {
		horizontal: [],
		vertical: [],
		leftDiagonal: false,
		rightDiagonal: false,
		completed: 0
	};

	for(var i=0; i<matchedCard.length; i++) {
		var state = matchedCard[i];
		// Checks horizontal
		if(i%matrixIndex === 0 && matchedCard[i]) {
			var horizontalValid = true;
			for(var j=i+1; j<matrixIndex+i; j++) {
				if (!matchedCard[j]) {
					horizontalValid = false;
					break;
				}
			}
			if (horizontalValid) {
				// console.log(i/matrixIndex + 1 + " horizontal row is valid");
				results.horizontal.push(i/matrixIndex);
				results.completed++;
			}
				
		}

		//Checks vertical
		if(i < matrixIndex && matchedCard[i]) {
			var verticalValid = true;
			for(var j=i; j<matchedCard.length; j += matrixIndex) {
				if (!matchedCard[j]) {
					verticalValid = false;
					break;
				}
			}
			if (verticalValid) {
				// console.log(i + 1 + " vertical row is valid");
				results.vertical.push(i);
				results.completed++;
			}
		}
	}

	//Checks diagonal
	if (matchedCard[0]) {
		var leftDiagonalValid = true;
		for(var i=0; i< matrixIndex-1; i++) {
			var position = (i+1) * matrixIndex + (i+1);
			if (!matchedCard[position]) {
				leftDiagonalValid = false;
				break;
			}
		}
		if(leftDiagonalValid) {
			// console.log("left diagonal is valid");
			results.leftDiagonal = true;
			results.completed++;
		}
	}

	if(matchedCard[matrixIndex-1]) {
		var rightDiagonalValid = true;
		for(var i=0; i< matrixIndex; i++) {
			var position = (matrixIndex) * (i+1) - (i+1);

			if (!matchedCard[position]) {
				rightDiagonalValid = false;
				break;
			}
		}
		if(rightDiagonalValid) {
			// console.log("right diagonal is valid");
			results.rightDiagonal = true;
			results.completed++;
		}
	}

	return results;
}