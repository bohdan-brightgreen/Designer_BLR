/**
 * app.ui.create_panel_rooms
 * Panel to add rooms to designer
 *
 */
app.ui.create_panel_rooms = {
	element: null,
	draw_rect_button: null,
	draw_free_button: null,

	init: function() {
		this.element = $('#add_rooms_panel');
		this.draw_rect_button = $('#room_draw_rect');
		this.bind_events();
	},

	bind_events: function() {
		app.sub('add_mode_change', this.on_add_mode_change, this);
		app.sub('tool_room.draw_activate', this.on_room_draw_rect_activate, this);
		app.sub('tool_room.draw_deactivate', this.on_room_draw_rect_deactivate, this);

		this.draw_rect_button.click($.proxy(this.on_room_draw_rect_click, this));
	},

	show: function() {
		this.element.show();
	},

	on_room_draw_rect_activate: function() {
		this.element.find('.togglable.active').removeClass('active');
		this.draw_rect_button.addClass('active');
	},

	on_room_draw_rect_deactivate: function() {
		this.draw_rect_button.removeClass('active');
	},

	on_room_draw_rect_click: function() {
		app.designer.toggle_tool('room.draw');

		if ($.isEmptyObject(app.designer.rooms)) {
			app.ui.show_tooltip('Draw your first room...');
		}
	}
};