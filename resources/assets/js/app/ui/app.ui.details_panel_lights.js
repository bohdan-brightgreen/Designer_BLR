app.ui.details_panel_lights = {
	room: null,
	should_display: false,
	element: null,

	init: function() {
		this.element = $('#lighting_details_panel');
		this.bind_events();
	},

	bind_events: function() {
		app.sub('designer_room_light_add', this.on_room_light_add, this);
		app.sub('designer_room_light_remove', this.on_room_light_removed, this);
		app.sub('designer_area_loaded', this.on_designer_area_loaded, this);
		app.sub('room_light_group_added', this.on_room_light_group_added, this);
		app.sub('room_light_group_removed', this.on_room_light_group_removed, this);
		app.sub('custom_light_field_change', this.on_custom_light_field_change, this);
	},

	init_panel: function() {

	},

	refresh_project_details: function() {
        this.renderLightDetails(false);
	},

	refresh_room_details: function() {
        this.renderLightDetails(true);
	},

    renderLightDetails: function(isRoom)
    {
        var space = {},
            lights = [];

        if (isRoom) {
            space = this.room;
            lights = space.lights;

        } else {
            space = app.designer;
            for (var i in space.rooms) {
                lights = lights.concat(_.toArray(space.rooms[i].lights));
            }
        }

        var light_counts = _.countBy(lights, 'code');

        light_counts = _.map(light_counts, function(val, index, arr) {
            var light = _.find(lights, {'code': index});

            return {
                code: index,
                colour: light.display_colour,
                count: val + ' Units'
            };
        });

        app.ui.render_template("light_summary_list_template", light_counts, "#light_summary_list");
        $('#light_summary_list .collapsible_header:first').addClass('no_border');

        app.designer.refresh_rooms_status();

        this.show_light_indicator(space.recommended_lumens, space.reached_lumens);

        var info = [
            {name: 'Floor Plane Lux', value: Math.round(space.reached_lux) + 'lux'},
            {name: 'Work Plane Lux', value: Math.round(space.reached_workplane_lux) + 'lux'},
            {name: 'Current Wattage', value: Math.round(space.reached_wattage) + 'W [' + Math.round(space.reached_wattage_sqm) + 'W/sqm]'},
            {name: 'Recommended Wattage', value: Math.round(space.recommended_wattage) + 'W [' + Math.round(space.recommended_wattage_sqm) + 'W/sqm]'},
            {name: 'Current Lumen Output', value: Math.round(space.reached_lumens) + 'lm'},
            {name: 'Recommended Lumen Output', value: Math.round(space.recommended_lumens) + 'lm'}
        ];

        app.ui.render_template("light_indicator_list_template", info, "#light_indicator_list");
    },

	/*on_base_asset_selected: function(e, base_asset) {
		if (app.ui.is_paused()) {
			return;
		}

		if (base_asset instanceof app.Room) {
			this.room = base_asset;

		} else if (base_asset.room) {
			this.room = base_asset.room;
		}

		if (this.should_display) {
			this.show();
		}
	},*/

	/*on_base_asset_unselected: function(e, base_asset) {
		this.room = null;

		if (app.ui.is_paused()) {
			return;
		}

		if (this.should_display) {
			this.show();
		}
	},*/

	on_room_light_add: function(e, room, asset) {
		if (app.ui.is_paused()) {
			return;
		}

		if (this.room && this.room == room){
			this.refresh_room_details();

		} else {
			this.refresh_project_details();
		}
	},

	on_room_light_removed: function(e, room) {
		if (app.ui.is_paused()) {
			return;
		}

		if (this.room && this.room == room){
			this.refresh_room_details();

		} else {
			this.refresh_project_details();
		}
	},

	on_designer_area_loaded: function() {
		this.refresh_project_details();
	},

	on_room_light_group_added: function(e, room, light_group) {
		if (this.room && this.room == room){
			this.refresh_room_details();

		} else {
			this.refresh_project_details();
		}
	},

	on_room_light_group_removed: function(e, room) {
		if (this.room && this.room == room){
			this.refresh_room_details();

		} else {
			this.refresh_project_details();
		}
	},

	on_custom_light_field_change: function() {
		this.refresh_room_details();
	},

	show_light_indicator: function(recommended_lumens, reached_lumens) {
		this.element.find('.light_indicator').hide();
		if (reached_lumens === 0) {
			this.element.find('.no_lights').show();

		} else {
			var percent = (reached_lumens / recommended_lumens) * 100;
			if (percent < 70) {
				this.element.find('.too_dim').show();

			} else if (percent > 130) {
				this.element.find('.too_bright').show();

			} else {
				this.element.find('.about_right').show();
			}
		}
	},

	show: function() {
		if (!this._has_initted_panel) {
			this.init_panel();
			this._has_initted_panel = true;
		}

		if (this.room) {
			this.refresh_room_details();

		} else {
			this.refresh_project_details();
		}

		this.element.show();
	},

	hide: function() {
		this.element.hide();
	}
};