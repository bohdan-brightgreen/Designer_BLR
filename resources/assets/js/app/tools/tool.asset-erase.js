/**
 *	Tool asset.erase
 *	Delete assets from the designer
 *
 */

var asset_erase = new (Tool.extend({
	name: 'asset.erase',
	capture_mouse: false,
	previous_width: null,
	previous_height: null,
	room: null
}))();


asset_erase.on_activate = function() {
	app.designer.set_cursor('crosshair', true);
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');
};

asset_erase.onMouseMove = function(event) {
	//highlight the asset that will be deleted on click
	if (app.designer.active_asset) {
		app.designer.active_asset.path.style.strokeColor = 'red';
		app.designer.active_asset.path.style.strokeWidth = 2;
	}
};


asset_erase.onMouseUp = function(event) {
	if (app.designer.active_asset) {
		if (app.designer.active_asset.group) {
			app.designer.active_asset.remove(true, true);
			app.designer.active_asset.circuit.redraw_connections();

		} else {
			app.designer.active_asset.remove();
		}
	}
};

asset_erase.on_deactivate = function() {
	app.designer.reset_cursor('crosshair');
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[asset_erase.name] = asset_erase;