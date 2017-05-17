/**
 *	Class app.DistanceLine
 *	Represents a distance line between two points, includes meters text.
 *
 */
app.DistanceLine = Class.extend({
	from_point: null,
	to_point: null,
	label_text: null,
	group: null,
	path: null,
	path_text: null,
	path_text_background: null,

	LINE_COLOR: '72b7f6',
	TEXT_COLOR: 'black',
	TEXT_SIZE: 15,
	BG_COLOR: "white",
	BG_OPACITY: 0.6,


	init: function(from, to) {
		if (from && to) {
			this.set_points(from, to);
		}

		//setup basic components...
		this.path = new Path.Line();
		this.path.strokeColor = this.LINE_COLOR;

		this.path_text = new PointText();
		this.path_text.justification = 'center';
		this.path_text.fillColor = this.TEXT_COLOR;
		this.path_text.fontSize = this.TEXT_SIZE;

		this.path_text_background = Path.Rectangle(200, 200, 200, 200);
		this.path_text_background.fillColor = this.BG_COLOR;
		this.path_text_background.fillColor.alpha = this.BG_OPACITY;

		this.group = new Group([this.path, this.path_text, this.path_text_background]);

		this.path.ignore_events = true;
		this.path_text.ignore_events = true;
		this.path_text_background.ignore_events = true;
		this.group.ignore_events = true;
	},

	set_points: function(from, to) {
		this.from_point = from;
		this.to_point = to;
	},

	refresh_points: function(from, to) {
		this.set_points(from, to);
		this.draw();
	},

	draw: function() {
		this.path.segments[0].point = this.from_point;
		this.path.segments[1].point = this.to_point;

		this.label_text = ((this.path.length / app.designer.room_scale).toFixed(1) + "m");
		var label_point = this.get_label_point();
		this.path_text.content = this.label_text;
		this.path_text.setPoint(label_point);

		if (paper.view.zoom < 1) {
			this.path_text.bounds.height = 10 + (10 / paper.view.zoom);
			this.path_text.bounds.width = 20 + (20 / paper.view.zoom);

		} else {
			this.path_text.bounds.height = 20 / (paper.view.zoom);
			this.path_text.bounds.width = 40 / (paper.view.zoom);
		}

		//draw bg rect...
		this.path_text_background.setBounds(this.path_text.bounds);
		this.path_text_background.moveBelow(this.path_text);

		if (!this.group.visible) {
			this.show();
		}
	},

	get_label_point: function(label_text) {
		var text_point = new Point(this.path.bounds.center.x, this.path.bounds.center.y + 3);

		//this bit is to just add an offset if it is a particularly short line
		//so that text label don't get drawn over the top of eachother
		if (this.path.length < 20) {
			var start = this.path.segments[0].point,
			    end = this.path.segments[1].point;

			if (start.x < end.x) {
				text_point = new Point(this.path.bounds.center.x - 20, this.path.bounds.center.y - 3);

			} else if (start.x > end.x) {
				text_point = new Point(this.path.bounds.center.x + 20, this.path.bounds.center.y - 3);
			}

			if (start.y < end.y) {
				text_point = new Point(this.path.bounds.center.x, this.path.bounds.center.y - 10);

			} else if (start.y > end.y) {
				text_point = new Point(this.path.bounds.center.x, this.path.bounds.center.y + 10);
			}
		}

		return text_point;
	},

	hide: function() {
		this.group.setVisible(false);
	},

	show: function() {
		this.group.setVisible(true);
	},

	remove: function() {
		this.group.remove();
	}
});