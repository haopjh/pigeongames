Bingo = new Meteor.Collection('bingo');

Meteor.methods({
	newBingo: function(bingoAttr){

		var shuffle = function(array) {
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
		
		var numberList = [];
		for(var i=1; i<=25; i++) {
			numberList.push(i);
		}
		
		numberList = shuffle(numberList);

		var bingo = _.extend(_.pick(bingoAttr, "playerList"), {
			playerTurn: bingoAttr.playerList[0],
			numberList: numberList,
			gameEnded: false,
			timestampCreated: new Date().getTime()
		});

		var bingoId = Bingo.insert(bingo);

	    return bingoId;
	}
});