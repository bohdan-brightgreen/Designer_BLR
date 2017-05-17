/**
 *	Tool asset.rotate
 *	Rotate provided asset on mouse move
 *
 */

var asset_rotate = new (Tool.extend({
	name: 'asset.rotate',
	capture_mouse: true,
	asset: null,
	step: 0,
	default_step: 5
}))();

asset_rotate.on_activate = function(params) {
	this.asset = params.asset;
	this.last_degree = 0;
	this.asset.hide_controls();
	this.center_x = this.asset.path.bounds.getCenterX();
	this.center_y = this.asset.path.bounds.getCenterY();
	this.step = (this.asset.rotation_step !== undefined ? this.asset.rotation_step : this.default_step);

	app.designer.set_cursor('rotate');
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');
};

asset_rotate.onMouseDrag = function(event) {
	var radians = Math.atan2(event.point.x - this.center_x, event.point.y - this.center_y);

	this.degree = (radians * (180 / Math.PI) * -1) + 90;
	this.degree = Math.round(this.degree / this.step) * this.step;

	if (this.degree != this.last_degree) {
		var delta = (this.degree - this.last_degree);
		this.asset.rotate_by(delta);
		this.last_degree = this.degree;
	}
};

asset_rotate.onMouseUp = function(event) {
	app.designer.reset_cursor();
	app.designer.deactivate_tool('asset.rotate');

	if (this.asset.group) {
		this.asset.group.on_finish_rotate();
	}

	if (this.asset.path.contains(event.point)) {
		this.asset.show_controls();

	} else {
		this.asset.unselect();
		this.asset.set_active(false);
	}

	this.asset.lock_to_room();
	this.asset = null;
	app.designer.ignore_tool_mouseup = true;
};

asset_rotate.on_deactivate = function(params) {
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[asset_rotate.name] = asset_rotate;