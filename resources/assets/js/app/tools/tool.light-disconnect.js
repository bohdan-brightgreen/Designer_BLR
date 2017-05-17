/**
 *	Tool light.disconnect
 *	Disconnect one light circuit from the other
 *
 * NOTE - actually logistics handled within the light class...
 *
 */

var light_dis = new (Tool.extend({
	name: 'light.disconnect',
	capture_mouse: true
}))();

light_dis.on_activate = function(params) {
	app.designer.set_cursor('no-drop', true);
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');
};

light_dis.on_deactivate = function(params) {
	app.designer.reset_cursor('no-drop');
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[light_dis.name] = light_dis;