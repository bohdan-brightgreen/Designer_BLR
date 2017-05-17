/**
 *	Tool room.draw
 *	Draw a room
 *
 */
var room_draw = new (Tool.extend({
	name: 'room.draw',
	capture_mouse: true,
	previous_width: null,
	previous_height: null,
	room: null,
	is_drawing_room: null,
	snap_lines: null,
	downpoint_x: null,
	downpoint_y: null,
	SNAP_TOLERANCE: 4,
	mode: null,
	free_line: null,
	has_clicked: null,
	FREEHAND_SNAP_DISTANCE: 10,
	snap_indicator: null,
	click_count: null
}))();

room_draw.on_activate = function(params) {
	this.is_drawing_room = false;
	app.designer.set_cursor('crosshair', true);
	app.designer.clear_selected();
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');

	this.mode = null;
	this.has_clicked = false;
	this.click_count = 0;
};

room_draw.onMouseMove = function(event) {
	if (this.mode == "free" && this.has_clicked && this.room !== null) {
		if (this.free_line) {
			this.free_line.remove();
		}

		this.free_line = new Path();
		this.free_line.strokeColor = this.room.active_style.strokeColor;
		this.free_line.strokeWidth = this.room.active_style.strokeWidth;
		this.free_line.add(new Point(this.downpoint_x, this.downpoint_y));
		this.free_line.add(event.point);

		//highlight the start segment if we are going to snap
		if (event.point.getDistance(this.room.path.segments[0].point) < this.FREEHAND_SNAP_DISTANCE) {
			if (this.snap_indicator === null) {
				this.snap_indicator = new Path.Circle(this.room.path.segments[0].point, this.FREEHAND_SNAP_DISTANCE);
				this.snap_indicator.strokeColor = 'black';
				this.snap_indicator.fillColor = '#009933';
				this.snap_indicator.fillColor.alpha = 0.5;
			}

		} else {
			if (this.snap_indicator !== null) {
				this.snap_indicator.remove();
				this.snap_indicator = null;
			}
		}
	}

	this.draw_snap_lines(event);
};

room_draw.onMouseDown = function(event) {
	this.previous_width = 1;
	this.previous_height = 1;

	this.downpoint_x = (this.snap_to_x || event.point.x);
	this.downpoint_y = (this.snap_to_y || event.point.y);

	if (this.mode == "free") {

	} else {
		this.room = new app.Room({
			x: this.downpoint_x,
			y: this.downpoint_y,
			width: 1,
			height: 1
		});
	}

	this.is_drawing_room = true;
};

room_draw.onKeyDown = function(event) {
	if (event.key === "escape") {
		this.cancel_free_draw();
	}
};

room_draw.onMouseDrag = function(event) {
	if (this.mode == "free") {
		return;
	}

	if (this.is_drawing_room) {
		var w = event.point.x - this.downpoint_x,
		    h = event.point.y - this.downpoint_y;

		var scale_x = w / this.previous_width,
		    scale_y = h / this.previous_height;

		if (scale_x === 0 || scale_y === 0) {
			return;
		}

		this.room.path.scale(scale_x, scale_y, new Point(this.downpoint_x, this.downpoint_y));
		this.draw_snap_lines(event);

		this.previous_width = w;
		this.previous_height = h;
	}
};

room_draw.find_nearest_rooms = function(event) {
	var to_point = new Point(event.point.x, event.point.y),
	    assets = app.designer.rooms,
	    tolerance = this.SNAP_TOLERANCE,
	    compare_points = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
	    exclusions = [];

	exclusions.push($.proxy(function(asset) {
        return (this.room && (asset.id === this.room.id));
    }, this));

	return app.snap_manager.find_nearest_asset_points(to_point, 'xy', assets, tolerance, compare_points, exclusions);
};

room_draw.draw_snap_lines = function(event) {
	this.snap_lines = [];

	var result = this.find_nearest_rooms(event);

	this.snap_to_x = (result.x_point) ? result.x_point.x : null;
	this.snap_to_y = (result.y_point) ? result.y_point.y : null;

	app.snap_manager.draw_lines(result, event.point);
};

room_draw.onMouseUp = function(event) {
	if (event.point.getDistance(new Point(this.downpoint_x, this.downpoint_y)) < 10) {
		this.onMouseClick(event);
		return;
	}

	if (this.mode == "free") {
		this.cancel_free_draw();
		return;
	}

	if (this.is_drawing_room) {
		app.snap_manager.remove_lines();

		var closest,
		    bounds;

		if (this.snap_to_x) {
			closest = this.room.get_closest_side_by_axis(event.point.x, 'x');
			bounds = {};
			bounds[closest.side] = this.snap_to_x;
			this.room.resize_bounds(bounds);
		}

		if (this.snap_to_y) {
			closest = this.room.get_closest_side_by_axis(event.point.y, 'y');
			bounds = {};
			bounds[closest.side] = this.snap_to_y;
			this.room.resize_bounds(bounds);
		}

		//if too small - bail out...
		if (this.room.path.bounds.width < 5 || this.room.path.bounds.height < 5) {
			this.room.remove();
			this.is_drawing_room = false;
			return;
		}

		app.designer.rooms[this.room.id] = this.room;

		/*var settings_event = {event: {
			x: event.event.x,
			y: (event.event.y - this.room.path.bounds.height + 50)
		}};*/

		app.pub('designer_room_created', [this.room]);
	}

	this.room = null;
	this.is_drawing_room = false;
};

room_draw.onMouseClick = function(event) {
	this.click_count++;
	this.mode = "free";
	//cancel the room draw if it's a right click
	if (event.event.button == 2) {
		this.cancel_free_draw();
		return;
	}

	var e_x = (this.snap_to_x) ? this.snap_to_x : event.point.x,
	    e_y = (this.snap_to_y) ? this.snap_to_y : event.point.y,
	    point = new Point(e_x, e_y);

	if (!this.has_clicked) {
		if (this.room !== null) {
			this.room.remove();
			this.room = null;
		}

		this.room = new app.Room({
			x: this.downpoint_x,
			y: this.downpoint_y,
			width: 1,
			height: 1
		});

		this.room.path.insert(0, point);
		this.room.path.closed = false;
		this.has_clicked = true;

	} else {

		if (event.point.getDistance(this.room.path.segments[0].point) < this.FREEHAND_SNAP_DISTANCE) {
			if (this.room.path.segments.length > 2) {
				this.room.path.closed = true;
				this.has_clicked = false;
				this.click_count = 0;
				this.free_line.remove();

				if (this.snap_indicator !== null) {
					this.snap_indicator.remove();
					this.snap_indicator = null;
				}

				app.designer.rooms[this.room.id] = this.room;
				app.pub('designer_room_created', [this.room]);

				this.room = null;
				this.mode = null;

			} else {
				this.room.path.add(this.room.path.segments[0].point);
			}

		} else {
			this.free_line.remove();

			//this is to clean up the extra segments that were added when the room was created
			//we need at least 2 segments so on the second click we are removing the redundant ones
			if (this.click_count == 2) {
				this.room.path.insert(1, point);
				this.room.path.removeSegments(2, 6);

			} else {
				this.room.path.add(point);
			}
		}
	}
};

room_draw.cancel_free_draw = function() {
	if (this.snap_indicator !== null) {
		this.snap_indicator.remove();
		this.snap_indicator = null;
	}

	this.has_clicked = false;
	this.click_count = 0;

	if (this.room !== null) {
		this.room.remove();
	}

	this.free_line.remove();
	this.room = null;
	this.mode = null;
};

room_draw.on_deactivate = function(params) {
	if (this.mode == "free") {
		this.cancel_free_draw();
	}

	app.snap_manager.remove_lines();
	this.is_drawing_room = false;

	app.designer.reset_cursor('crosshair');
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[room_draw.name] = room_draw;