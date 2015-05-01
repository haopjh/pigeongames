Template.login.events({
	"click .login-btn": function(e, template) {
		template.$(".login-username").removeClass("active");
		template.$(".login-password").removeClass("active");
		var username = template.$(".login-username").val();
		var password = template.$(".login-password").val();

		if(username && password) {
			Meteor.loginWithPassword(username, password, function(err) {
				console.log(err);
				if(err){
					Accounts.createUser({
						username: username,
						password: password
							
					}, function(err) {
						if(err) {
							console.log(err);
						}
					});
				}
			})
				
		} else {
			if(!username) {
				template.$(".login-username").addClass("active");
			}
			if(!password) {
				template.$(".login-password").addClass("active");
			}
		}
    },

	"click .login-dropdown": function(e, template) {
		if(template.$(".login-wrap").hasClass("active")) {
			template.$(".login-wrap").removeClass("active");
		} else {
			template.$(".login-wrap").addClass("active");
		}
    },

    "click .login-signout": function(e, template) {
    	Meteor.logout();
    }
});