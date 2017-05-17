/**
 * app.ui.room_controls
 * Control panel for room (over canvas)
 *
 */
app.ui.room_controls = {

	light_tools_panel: null,
	room_tools_panel: null,
	should_display_light_tools: false,
	room: null,

	init: function() {
		this.light_tools_panel = $('#room_light_controls');
		this.room_tools_panel = $('#room_controls');

		this.bind_events();
	},

	bind_events: function() {
		app.sub('add_mode_change', this.on_add_mode_change, this);
		app.sub('designer_room_selected', this.on_room_selected, this);
		app.sub('designer_room_unselected', this.on_room_unselected, this);
		app.sub('designer_room_restructure_start', this.on_event_hide, this);
		app.sub('designer_room_restructure_end', this.on_event_show, this);
		app.sub('designer_zoom_change', this.on_event_zoom_change, this);
		app.sub('tool_view.pan_activate', this.on_event_hide, this);
		app.sub('tool_view.pan_deactivate', this.on_event_show, this);
		app.sub('area_selected', this.on_area_selected, this);
		app.sub('designer_room_remove', this.on_room_remove, this);

		app.sub('tool_light.draw.point_deactivate', this.on_light_draw_point_deactivate, this);
		app.sub('tool_light.draw.string_deactivate', this.on_light_draw_string_deactivate, this);
		app.sub('tool_light.draw.grid_deactivate', this.on_light_draw_grid_deactivate, this);

		this.light_tools_panel.find('#light_tool_point').click($.proxy(this.on_point_click, this));
		this.light_tools_panel.find('#light_tool_line').click($.proxy(this.on_line_click, this));
		this.light_tools_panel.find('#light_tool_grid').click($.proxy(this.on_grid_click, this));
		this.light_tools_panel.find('#light_tool_round').click($.proxy(this.on_round_click, this));

		this.room_tools_panel.find('#room_tool_settings').click($.proxy(this.on_settings_click, this));
		this.room_tools_panel.find('#room_tool_zoom').click($.proxy(this.on_zoom_click, this));

		//reposition panels on resize...
		$(window).resize($.proxy(function() {
			if (this.room_tools_panel.is(':visible')) {
				this.reposition_panels();
			}
		}, this));
	},

	on_light_draw_point_deactivate: function() {
		_.delay($.proxy(function() {
            this.light_tools_panel.find('#light_tool_point').removeClass('active');
        }, this), 10);
	},

	on_light_draw_string_deactivate: function() {
		_.delay($.proxy(function() {
            this.light_tools_panel.find('#light_tool_line').removeClass('active');
        }, this), 10);
	},

	on_light_draw_grid_deactivate: function() {
		_.delay($.proxy(function() {
            this.light_tools_panel.find('#light_tool_grid').removeClass('active');
        }, this), 10);
	},

	on_add_mode_change: function(e, mode) {
		if (mode === 'lights') {
			this.should_display_light_tools = true;

			if (this.room) {
				this.show();
			}

		} else {
			this.should_display_light_tools = false;

			if (this.is_visible()) {
				this.hide_light_tools();
			}
		}
	},

	on_room_selected: function(e, room) {
		this.room = room;
		this.on_event_show(e, room);
	},

	on_room_unselected: function(e, room) {
		this.room = null;
		this.on_event_unselect_rooms(e, room);
	},

	on_point_click: function() {
		app.designer.toggle_tool('light.draw.point');
	},

	on_line_click: function() {
		app.designer.toggle_tool('light.draw.string');
	},

	on_grid_click: function() {
		app.designer.toggle_tool('light.draw.grid');
	},

	on_round_click: function() {
		app.designer.toggle_tool('light.draw.grid');
	},

	on_zoom_click: function() {
		this.room.zoom_to();
	},

	on_settings_click: function(e) {
		app.pub('room_details_click');
	},

	on_event_show: function(e, room) {
		this.show(room);
	},

	on_event_unselect_rooms: function(e, room) {
		this.room = null;
		this.hide();
	},

	on_event_hide: function(e, room) {
		this.hide();
	},

	on_event_zoom_change: function() {
		if(this.room) {
			//show in small delay (paper needs to draw & refresh)
			_.delay($.proxy(function() {
				this.reposition_panels();
			}, this), 10);
		}
	},

	on_area_selected: function() {
		this.hide();
	},

	on_room_remove: function() {
		this.room = null;
		this.hide();
	},

	reposition_panels: function() {
		var room_position = app.designer.get_element_on_screen_position(this.room.path),
		    room_pixel_width = (this.room.path.bounds.width * paper.view.zoom),
		    room_pixel_height = (this.room.path.bounds.height * paper.view.zoom);

		if (this.should_display_light_tools) {
			this.light_tools_panel.css({
				top: (room_position.top - (this.light_tools_panel.height() + 10)),
				left: (room_position.left + ((room_pixel_width - this.light_tools_panel.width()) / 2))
			});
		}

		this.room_tools_panel.css({
			top: (room_position.top + ((room_pixel_height - this.light_tools_panel.height()) / 2)),
			left: (room_position.left + room_pixel_width + 10)
		});
	},

	is_visible: function() {
		return this.light_tools_panel.is(':visible');
	},

	show: function() {
		if (this.room) {
			this.reposition_panels(this.room);

			if (this.should_display_light_tools) {
				this.light_tools_panel.stop().fadeIn('fast');
				this.room_tools_panel.find('.light_tool').show();

			} else {
				this.room_tools_panel.find('.light_tool').hide();
			}

			this.room_tools_panel.stop().fadeIn('fast');
		}
	},

	hide: function() {
		this.light_tools_panel.stop().fadeOut('fast');
		this.room_tools_panel.stop().fadeOut('fast');
		this.deactivate_active_tools();
	},

	hide_light_tools: function() {
		this.light_tools_panel.stop().fadeOut('fast');
		this.room_tools_panel.find('.light_tool').hide();
		this.deactivate_active_tools();
	},

	deactivate_active_tools: function() {
		this.light_tools_panel.find('li.active a').click();
		this.room_tools_panel.find('li.active a').click();
	}
};