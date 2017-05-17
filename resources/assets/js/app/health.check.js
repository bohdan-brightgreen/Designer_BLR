app.health_check = {
	element: null,
	dialog: null,
	results: null,
	mode: null,

	show: function() {
		this.element = $('#healthcheck');
		this.dialog = this.element.dialog({
			title: "Designer Health Check",
			width: 500,
			height: 500,
			modal: true,
			buttons: {
				"Run check": function() {
					app.health_check.check();
				},
				"Attempt to fix issues": function() {
					app.health_check.fix();
				},
				Close: function() {
					$(this).dialog( "close" );
				}
			}
		});

		this.element.find("textarea").val("Press 'Run check' below to look for potential issues...");
	},

	check: function() {
		this.mode = 'check';
		this.results = [];
		this.check_rooms();

		this.show_results();
	},

	fix: function() {

		app.designer.active_room.set_active(false);

		this.mode = 'fix';
		this.results = [];
		this.check_rooms();

		app.designer.draw_circuits();
		this.show_results();
	},

	show_results: function() {
		var text = "";

		if (this.mode === "check") {
			text += "Health Check Results:" + "\n";

		} else {
			text += "Health Check Fix Results:" + "\n";
		}

		text += "---------------------------------------------------------" + "\n";

		if (this.results.length > 0) {
			var list = _.map(this.results, function(result){ return ("- " + result); });
			text += list.join("\n");
			text += "\n\n";

			if (this.mode === "check") {
				text += this.results.length  + " possible issues found" + "\n";

			} else {
				text += (this.results.length / 2) + " possible issues fixed" + "\n";
				text += "Please confirm issues are resolved and save the Project." + "\n";
			}

		} else {
			text += "No issues detected." + "\n";
		}

		this.element.find('textarea').val(text);
	},

	check_rooms: function() {
		for (var r in app.designer.rooms) {
			var room = app.designer.rooms[r];

			//check circuits...

			//check light groups...

			//check assets (and lights)...
			for (var l in room.assets) {
				this.check_within_room_bounds(room, room.assets[l]);
			}
		}
	},

	check_within_room_bounds: function(room, asset) {
		//ar within = room.path.bounds.contains( asset.raster.bounds );

		if (!asset.is_in_room()) {
			this.results.push("Asset type " + asset.type + " with id " + asset.id + " is outside of room bounds");
			//console.info("Asset type " + asset.type + " with id " + asset.id + " is outside of room bounds", asset.path.bounds.center.x, asset.path.bounds.center.y);
			//console.info("Room bounds", room.path.bounds.center.x, room.path.bounds.center.y, room.path.strokeBounds.center.x, room.path.strokeBounds.center.y);

			if (this.mode === "fix") {
				asset.move(room.path.bounds.center.x, room.path.bounds.center.y);
				this.results.push("Fixed - moved to center of containing room");
			}
		}
	}
};