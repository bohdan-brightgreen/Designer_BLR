/**
 * app.ui.asset_controls
 * Control panel for assets (over canvas)
 *
 */
app.ui.asset_controls = {

	element: null,
	control_buttons: null,
	selected_asset: null,

	init: function() {
		this.element = $('#asset_controls');
		this.control_buttons = this.element.find('li');

		this.bind_events();
	},

	bind_events: function() {
		this.element.find('#asset_tool_link').click($.proxy(this.on_link_click, this));
		this.element.find('#asset_tool_unlink').click($.proxy(this.on_unlink_click, this));
		this.element.find('#asset_tool_rotate').click($.proxy(this.on_rotate_click, this));
		this.element.find('#asset_tool_note').click($.proxy(this.on_note_click, this));
		this.element.find('#asset_tool_flip').click($.proxy(this.on_flip_click, this));

		app.sub('tool_light.connect_deactivate', this.on_light_connect_deactivate, this);
		app.sub('tool_light.disconnect_deactivate', this.on_light_disconnect_deactivate, this);

		app.sub('designer_asset_selected', this.on_designer_asset_selected, this);
		app.sub('designer_asset_unselected', this.on_designer_asset_unselected, this);
		app.sub('area_selected', this.on_area_selected, this);
		app.sub('designer_room_asset_remove', this.on_designer_room_asset_remove, this);

		//reposition panel on resize...
		$(window).resize($.proxy(function(){
			if (this.element.is(':visible') && this.selected_asset) {
				this.reposition(this.selected_asset);
			}
		}, this));
	},

	on_light_connect_deactivate: function() {
		_.delay($.proxy(function() {
            this.element.find('#asset_tool_link').removeClass('active');
        }, this), 10);
	},

	on_light_disconnect_deactivate: function() {
		_.delay($.proxy(function() {
            this.element.find('#asset_tool_unlink').removeClass('active');
        }, this), 10);
	},

	on_link_click: function() {
		app.designer.toggle_tool('light.connect');
	},

	on_unlink_click: function() {
		app.designer.toggle_tool('light.disconnect');
	},

	on_rotate_click: function(event) {
		app.designer.activate_tool('asset.rotate', {
            asset: this.selected_asset,
            point: {
                x: event.clientX,
                y: event.clientY
            }
        });
	},

	on_note_click: function(event) {
		this.selected_asset.show_note_dialog({
            x: event.clientX,
            y: event.clientY
        });
	},

	on_flip_click: function() {
		this.selected_asset.flip(event);
	},

	on_designer_asset_selected: function(e, asset) {
		this.selected_asset = asset;
		this.show_element();
	},

	on_designer_asset_unselected: function() {
		this.selected_asset = null;
		this.hide_element();
	},

	reposition: function(asset) {
		var controls_position = app.designer.get_element_on_screen_position(asset.room.path);
		controls_position.top -= (this.element.height() + 10);
		controls_position.left += ((asset.room.path.bounds.width * paper.view.zoom) - this.element.width()) / 2;

		this.element.css({
			top: controls_position.top,
			left: controls_position.left
		});
	},

	on_area_selected: function() {
		this.hide_element();
	},

	on_designer_room_asset_remove: function() {
		this.hide_element();
	},

	show_element: function() {
		//hide and show based on type of asset...
		this.control_buttons.show();

		//hide switch_only buttons if not switch
		if (!this.selected_asset.is_light_switch()) {
			this.control_buttons.filter('.switch_only').hide();
		}

		//hide door_only buttons if not door
		if (this.selected_asset.type !== 'door') {
			this.control_buttons.filter('.door_only').hide();
		}

		this.reposition(this.selected_asset);
		this.element.stop().fadeIn('fast');
	},

	hide_element: function() {
		this.element.stop().fadeOut('fast');
	}
};