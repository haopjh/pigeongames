var getRandomLetter = function() {
	var letterArray = "abcdefghijklmnopqustuvwxyz".split("");
	return letterArray[Math.round(Math.random()*26)-1];
}

Template.typistGame.events({
	"keyup input.input-container": function(e) {
		var generatedLetter = $(".letter-container").text();
		var typedLetter = $(e.currentTarget).val();
		if(generatedLetter !== typedLetter) {
			$(".letter-container").addClass("");
		} else {
			$(".letter-container").removeClass("warning");
			$(".typed-container").append(generatedLetter);
			$("input.input-container").val("");
			$(".letter-container").text(getRandomLetter());
			let countLength = $(".typed-container").text().length - 1;
			$(".count-container").text(countLength);

			var gameStartTime = Session.get("gameStartTime");
			if (!gameStartTime) {
				Session.set("gameStartTime", Date.now());
			} else {
				if (countLength >= 5) {
					console.log(gameStartTime);
					var duration = ((Date.now() - parseInt(gameStartTime))/1000);
					alert("You took " + duration + " seconds to complete");
				}
			}
				
		}
	}
});