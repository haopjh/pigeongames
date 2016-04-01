Bingo = new Meteor.Collection('bingo');

var shuffle = function() {
	var array = [];
	for(var i=1; i<=36; i++) {
		array.push(i);
	}

	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

Meteor.methods({
	newBingo: function(bingoAttr){
		
		var bingo = _.extend(_.pick(bingoAttr, "playerList"), {
			playerTurn: 1,
			chosenNumbers: [],
			playerCards: [shuffle()],
			gameStatus: "new",
			timestampCreated: new Date().getTime(),
			winners: []
		});

		var bingoId = Bingo.insert(bingo);

	    return bingoId;
	},

	addPlayer: function(id, username) {
		Bingo.update(id,{
			$addToSet: {
				playerList: username,
				playerCards: shuffle()
			}
		});
	}
});