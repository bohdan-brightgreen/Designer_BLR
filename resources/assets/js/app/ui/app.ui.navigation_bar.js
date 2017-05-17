/**
 * app.ui.navigation_bar
 * Navigation bar, bottom right of canvas.
 *
 */
app.ui.navigation_bar = {
	element: null,
	pan_button: null,

	init: function() {
		this.element = $('#navigation_bar');
		this.pan_button = this.element.find('#tool_pan');

		this.bind_events();
	},

	bind_events: function() {
		app.sub('design_selected', this.show, this);
		app.sub('tool_view.pan_activate', this.on_pan_tool_activate, this);
		app.sub('tool_view.pan_deactivate', this.on_pan_tool_deactivate, this);

		this.element.find('#tool_zoom_in').click($.proxy(this.on_zoom_in_click, this));
		this.element.find('#tool_zoom_out').click($.proxy(this.on_zoom_out_click, this));
		this.element.find('#tool_pan').click($.proxy(this.on_pan_click, this));
		this.element.find('#tool_rotate').click($.proxy(this.on_rotate_click, this));
		this.element.find('#tool_fit').click($.proxy(this.on_fit_click, this));
	},

	on_pan_tool_activate: function() {
		this.pan_button.addClass('active');
	},

	on_pan_tool_deactivate: function() {
		this.pan_button.removeClass('active');
	},

	on_zoom_in_click: function() {
		app.designer.zoom_in();
	},

	on_zoom_out_click: function() {
		app.designer.zoom_out();
	},

	on_pan_click: function() {
		app.designer.toggle_tool('view.pan');
	},

	on_rotate_click: function() {
		app.designer.rotate();
	},

	on_fit_click: function() {
		app.designer.zoom_to_fit();
	},

	show: function() {
		this.element.fadeIn();
	}
};