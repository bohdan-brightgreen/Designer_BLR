/**
 *	Tool light.draw.string
 *	Draw a string of lights
 *
 */

var lights_string = new (Tool.extend({
	name: 'light.draw.string',
	capture_mouse: false,
	previous_width: null,
	previous_height: null,
	starting_room: null,
	guide: null,
	circuit: null
}))();

lights_string.on_activate = function(params) {
	app.designer.set_cursor('crosshair', true);
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');
};

lights_string.onMouseDown = function(event) {
	if (!app.designer.active_room || !app.ui.create_panel_lights.selected_product) {
		if (!app.designer.active_room) {
			app.ui.show_tooltip('Lights must be placed inside a room', 3000);
		}

		return;
	}

	//draw guide...
	this.guide =  new Path();
	this.guide.strokeColor = '009933';
	this.guide.strokeWidth = '3';

	this.guide.add(new Point(event.point.x, event.point.y));
	this.guide.add(new Point(event.point.x, event.point.y));

	//keep track of initial room...
	this.starting_room = app.designer.active_room;
	this.capture_mouse = true;
};

lights_string.onMouseDrag = function(event) {
	if (this.guide) {
		this.guide.lastSegment.point = event.point;
	}
};

lights_string.onMouseUp = function(event) {
	if (!this.guide) {
		return;
	}

	//if ended up in different room...
	if (!this.starting_room) {
		this.guide.remove();

	} else if (!this.starting_room.path.contains(event.point)) {
		this.guide.remove();
		this.starting_room.set_active(false);

		app.ui.show_tooltip('Lights must be placed inside a room', 3000);

	} else {
		//create...
		app.light_manager.draw_string(this.starting_room, this.guide);
		this.guide.remove();
	}

	this.starting_room = null;
	this.capture_mouse = false;
};


lights_string.on_deactivate = function(params) {
	app.designer.reset_cursor('crosshair');
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[lights_string.name] = lights_string;