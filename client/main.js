Deps.autorun(function() {
	Meteor.subscribe('allUsers');
	Meteor.subscribe('allBingos');
});

Template.registerHelper("hasUser", function() {
	return Meteor.user();
})
Template.registerHelper("getAllUsers", function() {
	var users = Meteor.users.find({},{sort:{"profile.wins" : -1}});
	return users;
})