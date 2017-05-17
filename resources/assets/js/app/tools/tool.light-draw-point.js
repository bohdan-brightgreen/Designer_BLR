/**
 *	Tool light.draw.string
 *	Draw a single light onclick at x,y
 *
 */

var lights_point = new (Tool.extend({
	name: 'light.draw.point',
	capture_mouse: false
}))();

lights_point.on_activate = function(params) {
	app.designer.set_cursor('crosshair', true);
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');
};

lights_point.onMouseUp = function(event) {
	if (!app.designer.active_room || !app.ui.create_panel_lights.selected_product) {
		if (!app.designer.active_room) {
			app.ui.show_tooltip('Lights must be placed inside a room', 3000);
		}

		return;
	}

	var light_data = $.extend({}, app.ui.create_panel_lights.selected_product);
	light_data.x = (event.point.x - 8);
	light_data.y = (event.point.y - 8);
	var light = new app.Light(light_data);

	app.designer.active_room.add_asset(light);
	app.designer.active_room.circuit.show_connections(true);
};


lights_point.on_deactivate = function(params) {
	app.designer.reset_cursor('crosshair');
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[lights_point.name] = lights_point;