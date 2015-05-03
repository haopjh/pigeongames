Template.bingoList.helpers({
	getBingos: function() {
		return Bingo.find({gameEnded: false});
	}
})