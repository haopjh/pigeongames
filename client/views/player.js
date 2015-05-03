Template.playerList.helpers({
	getPlayers: function() {
		if(Meteor.user()){
			var userList = Meteor.users.find({
				username: {$ne: Meteor.user().username}
			});
				
			return userList;
		}
			
	}
});

Template.playerList.events({
	"click .player-item": function(e, template) {
		if(template.$(".player-item").hasClass("active")) {
			$(e.currentTarget).closest(".player-item").removeClass("active");
		} else {
			$(e.currentTarget).closest(".player-item").addClass("active");
		}
	}
});