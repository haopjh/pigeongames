Deps.autorun(function() {
	Meteor.subscribe('allUsers');
	Meteor.subscribe('allBingos');
});

Template.registerHelper("hasUser", function() {
	return Meteor.user();
})