Meteor.publish('allUsers', function(limit) {

	return Meteor.users.find({},
			{fields: {"username": 1}}
		);
});

Meteor.publish('allBingos', function() {

	return Bingo.find();
});


Meteor.users.allow({
	update: function() {
		return true;
	},
	remove: function() {
		return true;
	}
});