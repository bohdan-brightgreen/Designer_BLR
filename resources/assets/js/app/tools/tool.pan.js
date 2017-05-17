/**
 *	Tool view.pan
 *	Pane the project view on mousedrag
 *
 */

var view_pan = new (Tool.extend({
	name: 'view.pan',
	capture_mouse: true,
	previous_width: null,
	previous_height: null,
	room: null
}))();


view_pan.on_activate = function() {
	app.designer.set_cursor('move');
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');
};

view_pan.onMouseDrag = function(event) {
	var delta = event.delta;
	delta.x = (0 - (delta.x / 2));
	delta.y = (0 - (delta.y / 2));
	paper.view.scrollBy(delta);
};

view_pan.on_deactivate = function() {
	app.designer.reset_cursor();
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[view_pan.name] = view_pan;