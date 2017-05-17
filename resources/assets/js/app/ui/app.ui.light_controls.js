/**
 * app.ui.light_controls
 * Control panel for lights (over canvas)
 *
 */
app.ui.light_controls = {

	element: null,
	selected_light: null,
	should_display: null,

	init: function() {
		this.element = $('#light_controls');
		this.bind_events();
	},

	bind_events: function() {
		app.sub('add_mode_change', this.on_add_mode_change, this);
		app.sub('designer_light_selected', this.on_designer_light_selected, this);
		app.sub('designer_light_unselected', this.on_designer_light_unselected, this);
		app.sub('area_selected', this.on_area_selected, this);
		app.sub('designer_room_light_remove', this.on_designer_room_light_remove, this);

		app.sub('tool_light.connect_deactivate', this.on_light_connect_deactivate, this);
		app.sub('tool_light.disconnect_deactivate', this.on_light_disconnect_deactivate, this);

		app.sub('designer_lightgroup_selected', this.on_designer_lightgroup_selected, this);

		this.element.find('#light_tool_link').click($.proxy(this.on_link_click, this));
		this.element.find('#light_tool_unlink').click($.proxy(this.on_unlink_click, this));
		this.element.find('#light_tool_add').click($.proxy(this.on_add_click, this));
		this.element.find('#light_tool_remove').click($.proxy(this.on_remove_click, this));
		this.element.find('#light_tool_rotate').click($.proxy(this.on_rotate_click, this));

		//reposition panel on resize...
		$(window).resize($.proxy(function() {
			if (this.element.is(':visible') && this.selected_light) {
				this.reposition(this.selected_light);
			}
		}, this));
	},

	on_add_mode_change: function(e, mode) {
		if (mode === 'lights') {
			this.should_display = true;

			if (this.selected_light) {
				this.show();
			}

		} else {
			this.should_display = false;

			if (this.element.is(':visible')) {
				this.hide();
			}
		}
	},

	on_light_connect_deactivate: function() {
		_.delay($.proxy(function() {
            this.element.find('#light_tool_link').removeClass('active');
        }, this), 10);
	},

	on_light_disconnect_deactivate: function() {
		_.delay($.proxy(function() {
            this.element.find('#light_tool_unlink').removeClass('active');
        }, this), 10);
	},

	on_link_click: function() {
		app.designer.toggle_tool('light.connect');
	},

	on_unlink_click: function() {
		app.designer.toggle_tool('light.disconnect');
	},

	on_add_click: function() {
		this.selected_light.group.add_click();
		app.ui.draw();
	},

	on_remove_click: function() {
		this.selected_light.group.remove_click();
		app.ui.draw();
	},

	on_rotate_click: function(event) {
		app.designer.activate_tool('asset.rotate', {
            asset: this.selected_light,
            point: {
                x: event.clientX,
                y: event.clientY
            }
        });
	},

	on_designer_light_selected: function(e, light) {
		this.selected_light = light;

		if (this.should_display) {
			this.show();
		}
	},

	on_designer_lightgroup_selected: function(e, lightgroup) {
		if (this.selected_light === null || this.selected_light.group !== lightgroup) {
			this.selected_light = lightgroup.get_light_at(1);
		}
	},

	on_designer_light_unselected: function(e, light) {
		this.selected_light = null;

		if (this.should_display) {
			this.hide();
		}
	},

	on_area_selected: function() {
		this.hide();
	},

	on_designer_room_light_remove: function() {
		this.hide();
	},

	reposition: function(light) {
		var controls_position = app.designer.get_element_on_screen_position(light.room.path);
		controls_position.top -= (this.element.height() + 10);
		controls_position.left += ((light.room.path.bounds.width* paper.view.zoom) - this.element.width()) / 2;

		this.element.css({
			top: controls_position.top,
			left: controls_position.left
		});
	},

	show: function() {
		if (this.should_display) {
			//toggle group related buttons...
			this.element.find('.group_tool')[(this.selected_light.group ? 'show' : 'hide')]();
			this.reposition(this.selected_light);
			this.element.stop().fadeIn('fast');
		}
	},

	hide: function() {
		this.element.stop().fadeOut('fast');
	}
};