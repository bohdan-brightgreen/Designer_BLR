/**
 *	Tool light.draw.grid
 *	Draw a grid of lights
 *
 */

var lights_grid = new (Tool.extend({
	name: 'light.draw.grid',
	capture_mouse: false,
	previous_width: null,
	previous_height: null,
	starting_room: null,
	guide: null,
	circuit: null,
	grid_color: 'green'
}))();

lights_grid.on_activate = function(params) {
	app.designer.set_cursor('crosshair', true);
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');
};

lights_grid.onMouseDown = function(event) {
	if (!app.designer.active_room || !app.ui.create_panel_lights.selected_product) {
		if (!app.designer.active_room) {
			app.ui.show_tooltip('Lights must be placed inside a room', 3000);
		}

		return;
	}

	this.previous_width = 1;
	this.previous_height = 1;

	//draw guide...
	this.guide =  new Path.Rectangle(event.point.x, event.point.y, 1, 1);
	this.guide.strokeColor = this.grid_color;
	this.guide.strokeWidth = 2;

	//keep track of initial room...
	this.starting_room = app.designer.active_room;

	this.capture_mouse = true;
};

lights_grid.onMouseDrag = function(event) {
	if (!this.guide || this.previous_width === null) {
		return;
	}

	var w = event.point.x - event.downPoint.x,
	    h = event.point.y - event.downPoint.y;

	var scale_x = w / this.previous_width,
	    scale_y = h / this.previous_height;

	if (scale_x === 0 || scale_y === 0) {
		return;
	}

	this.guide.scale(scale_x, scale_y, new Point(event.downPoint.x, event.downPoint.y));

	this.previous_width = w;
	this.previous_height = h;
};

lights_grid.onMouseUp = function(event) {
	if (!this.guide || this.previous_width === null) {
		return;
	}

	//if ended up in different room...
	if (this.guide.bounds.width < 10 || this.guide.bounds.height < 10) {
		this.guide.remove();

	} else if (!this.starting_room.path.contains(event.point)) {
		this.guide.remove();
		this.starting_room.set_active(false);
		app.ui.show_tooltip('Lights must be placed inside a room', 3000);

	} else {
		//create...
		app.light_manager.draw_grid(this.starting_room, this.guide.getBounds());
		this.guide.remove();
	}

	this.previous_width = null;
	this.previous_height = null;
	this.starting_room = null;
	this.capture_mouse = false;
};


lights_grid.on_deactivate = function(params) {
	app.designer.reset_cursor('crosshair');
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[lights_grid.name] = lights_grid;