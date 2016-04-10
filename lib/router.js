Router.route("/", function() {
	this.render("homepage");
});

Router.route("/home", function() {
	this.render("homepage");
});

Router.route("/pitactoe");

Router.route("/bingo");
Router.route("/bingo/:_id", function() {
	var bingo = Bingo.findOne({_id: this.params._id});
	Session.set("bingoId", this.params._id);
	this.render("bingoGame", {data: bingo});
});
Router.route("/typist");
Router.route("/typist/:_id", function() {
	var typist = Typist.findOne({_id: this.params._id});
	Session.set("typistId", this.params._id);
	this.render("typistGame", {data: typist});
});