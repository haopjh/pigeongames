Template.pigeonbingo.events({
	"click .game-start-btn": function(e, template) {
		var username = template.$(".player-item.active").html().trim();
		var bingo = {
			playerList: [Meteor.user().username, username]
		};

		Meteor.call('newBingo', bingo, function(err, bingoId) {
			console.log("success with id:", bingoId);
		});
	}
});
