/**
 *	Class app.Room
 *	Represents a room.
 *
 */
app.Room = app.RestructurableAsset.extend({
	class: "room",
	type: null,
	color_temp: null,
	reflectivity: null,
	wall_length: null,
	circuit: null,
	all_circuits: null,

	assets: null,
	lights: null,
	light_switches: null,
	first_light_distance_lines: null,

	fixed_distance: 1,
	active: false,

	square_meters: null,
	recommended_lux: null,
	recommended_workplane_lux: null,
	recommended_lumens: null,
	recommended_wattage: null,
	recommended_wattage_sqm: null,

	reached_lux: null,
	reached_workplane_lux: null,
	reached_lumens: null,
	reached_wattage: null,
	reached_wattage_sqm: null,

	display_name : null,

	//defaults
	default_reflectivity: 'Light',
	default_color_temp: 'Cool',
	default_room_type: 'Other (Day Time Use)',

	//constants...
	LOSS_FROM_DIRECT_LIGHT: 0.62,
	REFLECTIVITY_LIGHT: 0.9,
	REFLECTIVITY_MEDIUM: 0.75,
	REFLECTIVITY_DARK: 0.55,
	//meters from wall
	FLOATING_LIGHT_MARGIN: 0.7,

	//style related...
	base_style: {
		fillColor: 'white',
		fillAlpha: 0.1,
		strokeColor: '#72b7f6',
		strokeWidth: 2
	},

	active_style: {
		fillColor: 'white',
		fillAlpha: 0.4,
		strokeColor: '#72b7f6',
		strokeWidth: 2
	},

	init: function(data) {
		this.create_path(data);

		this.id = this.path.id;

		//load or set defaults...
		this.type = (data.type || this.default_room_type);
		this.display_name =  (data.display_name || ('Room ' + parseInt(_.size(app.designer.rooms), 10)));
		this.color_temp = (data.color_temp || this.default_color_temp);
		this.reflectivity = (data.reflectivity || this.default_reflectivity);

		this.recommended_lux = (data.recommended_lux || 0);
		this.recommended_workplane_lux = (data.recommended_workplane_lux || 0);
		this.recommended_lumens = (data.recommended_lumens || 0);
		this.recommended_wattage = (data.recommended_wattage || 0);
		this.recommended_wattage_sqm = (data.recommended_wattage_sqm || 0);

		this.reached_lux = (data.reached_lux || 0);
		this.reached_workplane_lux = (data.reached_workplane_lux || 0);
		this.reached_lumens = (data.reached_lumens || 0);
		this.reached_wattage = (data.reached_wattage || 0);
		this.reached_wattage_sqm = (data.reached_wattage_sqm || 0);

		this.all_circuits = {};
		if (data.circuit) {
			if (app.designer.circuits[data.circuit] !== undefined) {
				this.circuit = app.designer.circuits[data.circuit];
				this.circuit.room = this;
			}

		} else {
			this.circuit = app.designer.get_new_circuit();
			this.circuit.room = this;
		}

		this.set_style(this.base_style);

		this.assets = {};
		if (data.assets) {
			this.import_assets(data.assets);
		}

		this.lights = {};
		if (data.lights) {
			this.import_lights(data.lights);
		}

		this.light_switches = {};
		if (data.light_switches) {
			this.import_light_switches(data.light_switches);
		}

		this.first_light_distance_lines = [];
		this.snap_lines = [];

        this._super();

		if (data && data.id) {
			this.id = data.id;
		}

		this.refresh_square_meters();
		this.refresh_recommended();
		this.refresh_reached(true);

		this.refresh_circuits();

		if (this.get_lights_count() > 0) {
			this.reconnect_light_switches();
		}
	},

	/*fixed_distance_position: function(pt) {
		pt.x = Math.round(pt.x / this.fixed_distance) * this.fixed_distance;
		pt.y = Math.round(pt.y / this.fixed_distance) * this.fixed_distance;
		return pt;
	},*/

	should_activate: function() {
		return (
			!app.dialog_showing &&
			(!app.designer.active_tool || !app.designer.active_tool.capture_mouse)
		);
	},

	on_mouse_enter: function(event) {
		this._super(event);

		if (app.designer.is_disconnect_active()) {
			this.set_switch_connections_editable(true);
		}

		if (!this.should_activate()) {
			return;
		}

		this.set_active(true);
	},

	set_switch_connections_editable: function(editable) {
		for (var i in this.all_circuits) {
			var circuit = this.all_circuits[i],
			    secondary_switches = circuit.secondary_switches;

			for (var s in secondary_switches) {
				var light_switch = secondary_switches[s];
				if (editable) {
					light_switch.show_connection(circuit);
				}

				light_switch.set_connection_editable(circuit, editable);
			}
		}
	},

	on_mouse_move: function(event) {
		this._super(event);

		if (!this.should_activate()) {
			return;
		}

		var hitOptions = {
			segments: true,
			handles: true,
			stroke: true,
			fill: false,
			tolerance: 3
		};

		var hitResult = paper.project.hitTest(event.point, hitOptions);

		if (!hitResult || hitResult.item.id != this.id) {
			this.set_style(this.active_style);
		}
	},

	on_mouse_down: function(event) {
		if (event.event.button == 2) {
			window.asset = this;
		}

		this._super(event);

		if (!this.should_activate()) {
			return;
		}
	},

	on_mouse_drag: function(event) {
		this._super(event);
	},

	on_mouse_up: function(event, resized) {
		this._super(event);
	},

	after_resizable_resize: function() {
		this.wall_length = null;
		this.refresh_square_meters();
		this.refresh_recommended();
		this.refresh_reached(true);
		//this.refresh_status();
	},

	on_mouse_leave: function(event) {
		this._super(event);

		if (app.designer.is_disconnect_active() && this.is_circuit_outline(event)) {
			return;
		}

		if (app.designer.is_disconnect_active()) {
			this.set_switch_connections_editable(false);
			this.hide_circuits();
		}

		//check to see if mouse still in bounds....
		if (this.path.contains(event.point) || app.dialog_showing) {
			return;
		}

		/*if(this.controls.contains(event.point) && this.should_activate()) {
			this.set_style(this.active_style);
			return;
		}*/

		this.set_active(false);

		if (app.is_dragging() && app.designer.drag_asset) {
            app.designer.drag_asset.hide_wall_distance_lines();
		}
	},

	resize_bounds: function(bounds) {
		var min_size = 3;
		var previous;

		if (bounds.top) {
			previous = this.path.bounds.top;
			this.path.bounds.top = bounds.top;

			if (this.path.bounds.height < min_size) {
				this.path.bounds.top = previous;
			}
		}

		if (bounds.right) {
			previous = this.path.bounds.right;
			this.path.bounds.right = bounds.right;

			if (this.path.bounds.width < min_size) {
				this.path.bounds.right = previous;
			}
		}

		if (bounds.bottom) {
			previous = this.path.bounds.bottom;
			this.path.bounds.bottom = bounds.bottom;

			if (this.path.bounds.height < min_size) {
				this.path.bounds.bottom = previous;
			}
		}

		if (bounds.left) {
			previous = this.path.bounds.left;
			this.path.bounds.left = bounds.left;

			if (this.path.bounds.width < min_size) {
				this.path.bounds.left = previous;
			}
		}

		this.width = this.path.bounds.width;
		this.height = this.path.bounds.height;

		//this.refresh_status();
	},

	is_circuit_outline: function(event) {
		//run a hit test...
		var hitOptions = {
			segments: true,
			handles: false,
			stroke: true,
			fill: false,
			tolerance: 1.5
		};

		var hitResult = paper.project.hitTest(event.point, hitOptions);

		return (hitResult && hitResult.item && hitResult.item.ld_type && hitResult.item.ld_type == 'circuit-outline');
	},

	add_asset: function(asset, keep_circuit) {
		if (!this.contains_asset(asset)) {
			var previous_room = asset.room;

			if (asset.is_light()) {
				if (asset.group) {
					this.add_light_group(asset.group, keep_circuit);
					return;

				} else {
					asset.room = this;
					this.add_light(asset, keep_circuit);
				}

			} else {
				asset.room = this;
				app.has_furniture = true;
			}

			//if asset was in another room...
			if (previous_room) {
				previous_room.remove_asset(asset);
			}

			if (asset.is_light_switch()) {
				this.add_light_switch(this.circuit, asset);
			}

			this.assets[asset.id] = asset;
		}

		app.pub("designer_room_" + (asset.is_light() ? 'light' : 'asset') + "_add", [this, asset]);
	},

	add_light: function(light, keep_circuit) {
		this.lights[light.id] = light;

		//if a light not in it's own circuit - add to room circuit
		if (!light.circuit) {
			this.circuit.add_item(light);

		} else {
			var previous_circuit = light.circuit;
			this.circuit.add_item(light);

			if (previous_circuit.room == this) {
				previous_circuit.show_connections(true);

			} else {
				previous_circuit.redraw_connections();
			}
		}

		this.reconnect_light_switches();

		this.refresh_reached(true);
		//this.refresh_status();
		app.has_lights = true;
	},

	get_all_light_switches: function() {
		return this.get_all_assets_of_type(['light-switch', 'light-switch-dimmer', 'light-switch-touch']);
	},

	add_light_switch: function(circuit, light_switch) {
		//if no light switch provide, find (or create) one...
		if (!light_switch) {
			//first check fo we have a light switch in the room we can use?
			var room_light_switches = this.get_all_light_switches();

			if (room_light_switches.length > 0) {
				//use first light switch?
				light_switch = room_light_switches[0];

			} else {
				//create new light switch...
				light_switch = new app.Asset.LightSwitch({x: 0, y: 0, type: 'light-switch'});
				var room_doors = this.get_all_assets_of_type('door');

				if (room_doors.length > 0) {
					//put light next to the first door knob...
					var door = room_doors[0],
					    pos = door.get_light_position(light_switch.width, light_switch.height);

					light_switch.rotate_by(door.rotation);

					var delta = {
						x: (pos.x - light_switch.path.position.x),
						y: (pos.y - light_switch.path.position.y)
					};

					light_switch.move_by(delta);

				} else {
					//put somewhere on the wall that makes sense
					var room_pos = this.path.strokeBounds.topLeft;

					//manually move...
					app.designer.drag_offset = {x:0, y:0};
					light_switch.move((room_pos.x + light_switch.width / 2), room_pos.y);
				}
			}
		}

		//if was previously in another room..
		if (light_switch.room) {
			light_switch.reset();
		}

		light_switch.room = this;
		this.refresh_circuits();

		//for each circuit present in room...
		for (var i in this.all_circuits) {
			circuit = this.all_circuits[i];

			//if this circuit's primary switch is in this room...
			if (!circuit.has_primary_switch() || (circuit.has_primary_switch() && circuit.primary_switch.room == this)) {
				//associate switch with circuit
				light_switch.add_circuit(circuit);

				if (!circuit.has_primary_switch()) {
					circuit.set_primary_switch(light_switch);

				} else {
					//add as secondary...
					circuit.add_secondary_switch(light_switch);
				}
			}
		}

		this.light_switches[light_switch.id] = light_switch;
		this.assets[light_switch.id] = light_switch;
		light_switch.move_finish();
	},

	reconnect_light_switches: function() {
		for (var c in this.all_circuits) {
			var circuit = this.all_circuits[c];

			//if the circuit has no primary switch - add (as if by magic)
			if (!circuit.has_primary_switch()) {
				//if the rooms circuit has a switch, use that...
				if (this.circuit.has_primary_switch()) {
					this.circuit.primary_switch.add_circuit(circuit);
					circuit.primary_switch = this.circuit.primary_switch;

				} else {
					this.add_light_switch(circuit);
				}
			}
		}
	},

	show_circuits: function() {
		if (app.is_dragging()) {
			return;
		}

		for (var c in this.all_circuits) {
			var circuit = this.all_circuits[c];
			circuit.show_connections();
		}
	},

	hide_circuits: function() {
		if (app.is_dragging()) {
			return;
		}

		for (var c in this.all_circuits) {
			var circuit = this.all_circuits[c];
			circuit.hide_connections();
		}
	},

	refresh_circuits: function() {
		if (app.is_dragging()) {
			return;
		}

		// populate all_circuits array with all light circuits in this room
		this.all_circuits = {};
		//if (this.circuit != null) {
			this.all_circuits[this.circuit.id] = this.circuit;
		//}

		for (var i in this.lights) {
			var light = this.lights[i];

			/*if(!light.circuit) {
				continue;
			}*/

			if (this.all_circuits[light.circuit.id] === undefined) {
				this.all_circuits[light.circuit.id] = light.circuit;
			}
		}
	},

	contains_asset: function(asset) {
		return (this.assets[asset.id] !== undefined);
	},

	remove_asset: function(asset) {
		if (asset.is_light()) {
			delete this.lights[asset.id];
			this.refresh_reached(true);
		}

		delete this.assets[asset.id];

		app.pub("designer_room_" + (asset.is_light() ? 'light' : 'asset') + "_remove", [this]);
	},

	add_light_group: function(group, keep_circuit) {
		var previous_circuit = null;

		for (var i in group.lights) {
			var light = group.lights[i];
			this.assets[light.id] = light;
			this.lights[light.id] = light;

			//if asset was in another room...
			if (light.room !== null && light.room.id !== this.id) {
				light.room.remove_asset(light);
			}

			light.room = this;

			if (!keep_circuit) {
				//persist previous circuit...
				if (previous_circuit === null && light.circuit) {
					previous_circuit = light.circuit;
				}

				this.circuit.add_item(light);
			}
		}

		this.refresh_reached(true);
		//this.refresh_status();

		if (previous_circuit) {
			if (previous_circuit.get_items_count() > 0) {
				if (previous_circuit.room == this) {
					previous_circuit.show_connections(true);

				} else {
					previous_circuit.redraw_connections();
					previous_circuit.room.reconnect_light_switches();
				}
			}
		}

		this.circuit.show_connections(true);
		this.reconnect_light_switches();

		app.pub('room_light_group_added', [this, group]);
	},

	/*remove_light_group: function(group) {
		for(var i in group.lights) {
			var light = group.lights[i];
			delete this.assets[light.id];
			delete this.lights[light.id];
		}

		this.refresh_reached(true);
		this.refresh_status();
		app.pub('room_light_group_removed', [this]);
	},*/

	set_active: function(active) {
		this._super(active);

		if (this.active) {
			this.show_circuits();

		} else {
			this.hide_circuits();

			var active_asset = app.designer.active_asset;

			if (active_asset && !app.is_dragging()) {
				active_asset.set_active(false);
			}
		}
	},

	select: function() {
		this.path.moveAbove(this.path.layer.lastChild);
		this._super();
	},

	unselect: function() {
		this._super();
	},

	get_zoom_to_factor: function() {
		var zoom_factor_width = (app.designer.element.width() / (this.path.bounds.width + 20)),
		    zoom_factor_height = (app.designer.element.height() / (this.path.bounds.height + 20)),
		    room_zoom_factor = (zoom_factor_width < zoom_factor_height) ? zoom_factor_width : zoom_factor_height;

		room_zoom_factor -= 0.1;

		return app.designer.sanitize_zoom(room_zoom_factor);
	},

	zoom_to: function() {
		app.designer.zoom(this.get_zoom_to_factor());
		var pos = {
            x: this.path.position.x,
            y: this.path.position.y
        };

		app.designer.set_center(pos);
	},

	preview_scale: function() {
		var preview_scale = Math.round((this.path.bounds.height / this.wall_length) * 100) / 100;
		app.designer.refresh_asset_scale(preview_scale);
	},


	show_wall_line: function() {
		this.wall_line = new Path();
		this.wall_line.strokeColor = 'red';
		this.wall_line.strokeWidth = 4;
		this.wall_line.dashArray = [15, 7];

		//var path_width = this.path.bounds.width,
        var path_height = this.path.bounds.height,
		    x1 = this.path.strokeBounds.x,
		    y1 = this.path.strokeBounds.y,
            x2 = this.path.strokeBounds.x,
		    y2 = (this.path.strokeBounds.y + path_height);

		this.wall_line_size = path_height;

		this.wall_line.add(new Point(x1, y1));
		this.wall_line.add(new Point(x2, y2));
		view.draw();
	},

	hide_wall_line: function() {
		if (this.wall_line) {
			this.wall_line.remove();
			this.wall_line = null;
			view.draw();
		}
	},

	get_room_length: function() {
		var scale = app.designer.room_scale;
        return (!scale) ? 0 : Math.round((this.path.bounds.height / scale) * 100) / 100;
	},

	get_room_width: function() {
		var scale = app.designer.room_scale;
		return (!scale) ? 0 : Math.round((this.path.bounds.width / scale) * 100) / 100;
	},

	get_room_height: function() {
		//average height
		return 2.7;
	},

	refresh_recommended: function() {
		app.designer.recommended_lux -= this.recommended_lux;
		this.refresh_recommended_lux();
		app.designer.recommended_lux += this.recommended_lux;

		app.designer.recommended_lumens -= this.recommended_lumens;
		this.refresh_recommended_lumens();
		app.designer.recommended_lumens += this.recommended_lumens;

		app.designer.recommended_wattage -= this.recommended_wattage;
		this.refresh_recommended_wattage();
		app.designer.recommended_wattage += this.recommended_wattage;
	},

	refresh_recommended_lux: function() {
		if (this.type) {
			var room_type = app.RoomTypes.Residential[this.type] || app.RoomTypes.Commercial[this.type] ;

			if (room_type && room_type.recommended_lux !== undefined) {
				this.recommended_lux = room_type.recommended_lux;
			}
		}

		if (!this.recommended_lux) {
			//default to 40?
			this.recommended_lux = 40;
		}

		//and workplane...
		this.recommended_workplane_lux = '-';
	},

	refresh_recommended_lumens: function() {
		var volume = this.get_volume();
		if (this.recommended_lux === 0) {
			this.recommended_lumens = 0;
			return;
		}

		var reflectivity = this.get_reflectivity_level();
		this.recommended_lumens = Math.ceil(this.recommended_lux * volume * (this.LOSS_FROM_DIRECT_LIGHT / reflectivity));
	},

	refresh_recommended_wattage: function() {
		var room_type = this.get_room_type();

        this.recommended_wattage_sqm = (room_type.recommended_wattage_sqm) ? room_type.recommended_wattage_sqm : 5;
		this.recommended_wattage = (this.recommended_wattage_sqm * this.square_meters);
	},

	refresh_reached: function(subtract_total) {
		if (subtract_total) {
			app.designer.reached_lumens -= this.reached_lumens;
			app.designer.reached_wattage -= this.reached_wattage;
		}

		this.refresh_reached_lumens();
		app.designer.reached_lumens += this.reached_lumens;
		app.designer.reached_wattage += this.reached_wattage;

		if (subtract_total) {
			app.designer.reached_lux -= this.reached_lux;
			app.designer.reached_workplane_lux -= this.reached_workplane_lux;
		}

		this.refresh_reached_lux();
		app.designer.reached_lux += this.reached_lux;
		app.designer.reached_workplane_lux += this.reached_workplane_lux;
	},

	refresh_reached_lumens: function() {
		//and wattage
		var count = this.get_lights_count();
		if (count > 0) {
			var reached_lumens = 0,
			    wattage_reached = 0;

			for (var i in this.lights) {
				var light = this.lights[i];
				reached_lumens += light.lumens;
				wattage_reached += light.wattage;
			}

			this.reached_lumens = reached_lumens;
			this.reached_wattage = wattage_reached;
			this.reached_wattage_sqm = (Math.round((this.reached_wattage / this.square_meters) * 10) / 10);

		} else {
			this.reached_lumens = 0;
			this.reached_wattage = 0;
			this.reached_wattage_sqm = 0;
		}
	},

	refresh_reached_lux: function() {
		// opposite of lumen formula... lumens_reached * (reflectivity discount & efficiency discount) / volume
		var volume = this.get_volume();

		if (volume === 0) {
			this.reached_lux = 0;
			this.reached_workplane_lux = 0;
			return;
		}

		var reflectivity = this.get_reflectivity_level(),
		    floorplane = Math.round((this.get_room_length() * this.get_room_width()) * 10) / 10;

        this.reached_lux = Math.round(this.reached_lumens / volume / (this.LOSS_FROM_DIRECT_LIGHT / reflectivity));
		this.reached_workplane_lux = Math.round(this.reached_lumens / floorplane / (this.LOSS_FROM_DIRECT_LIGHT / reflectivity));
	},

	get_volume: function() {
		return Math.round((this.get_room_length() * this.get_room_width() * this.get_room_height()) * 10) / 10;
	},

	refresh_square_meters: function() {
		this.square_meters = Math.round((this.get_room_length() * this.get_room_width()) * 10) / 10;
	},

	get_floating_light_bounds: function() {
		var pixels_from_wall = (this.FLOATING_LIGHT_MARGIN * app.designer.room_scale);

        return {
            x: (this.path.bounds.x + pixels_from_wall),
            y: (this.path.bounds.y + pixels_from_wall),
            width: (this.path.bounds.width - (2 * pixels_from_wall)),
            height: (this.path.bounds.height - (2 * pixels_from_wall))
        };
	},

    get_hover_status: function() {

    },

	/*get_hover_status: function() {
		if (app.designer.is_busy()) {
			return '';
		}

		var str = '';
		str += (this.display_name ? this.display_name : 'Room') + ' /  ';
		str += 'Recommended ';
		str += 'Lumens: ' + commarize(this.recommended_lumens) + ' ';
		str += 'Floor lux: ' + this.recommended_lux + ' ';
		str += 'Workplane lux: ' + this.recommended_workplane_lux + ' ';
		str += 'Power:' + this.recommended_wattage + 'W';
		str += ' ('+ this.recommended_wattage_sqm + 'W p/sqm)';

		str += '. Reached ';
		str += 'Lumens: ' + commarize(this.reached_lumens) + ' ';
		str += 'Floor lux: ' + this.reached_lux + ' ';
		str += 'Workplane lux: ' + this.reached_workplane_lux + ' ';
		str += 'Power: ' + this.reached_wattage + 'W';
		str += ' ('+ this.reached_wattage_sqm + 'W p/sqm)';
	},*/

	/*get_resizing_status: function() {
		var str = '';
		str += (this.display_name ? this.display_name : 'Room') + ' /  ';
		str += this.get_room_width() + 'x' + this.get_room_length() + ' (meters)';
		return str;
	},*/

	refresh_status: function() {
        if (!this.is_resizing) {
            app.designer.update_stats_box(this.recommended_lumens, this.reached_lumens);
        }

		/*if (this.is_resizing) {
			//app.set_status(this.get_resizing_status());

		} else {
			//app.set_status(this.get_hover_status());
			app.designer.update_stats_box(this.recommended_lumens, this.reached_lumens);
		}*/
	},

	get_lights_count: function() {
		var lights = this.lights,
		    count = 0;

		for (var k in lights) {
			if (lights.hasOwnProperty(k)) {
				count++;
			}
		}
		return count;
	},

	get_reflectivity_level: function() {
		switch(this.reflectivity) {
			case 'Light':
				return this.REFLECTIVITY_LIGHT;
			case 'Medium':
				return this.REFLECTIVITY_MEDIUM;
			case 'Dark':
				return this.REFLECTIVITY_DARK;
			default:
				return this.REFLECTIVITY_MEDIUM;
		}
	},

	calculate_best_guess: function() {
		if (this.get_reflectivity_level() === 0) {
			alert('Please choose a reflectivity level for this room in room settings.');
			return;
		}

		//remove all exisiting lights...
		for (var i in this.lights) {
			this.lights[i].remove();
		}

		app.light_manager.best_fit(this);
	},

	get_room_type: function() {
		var property_rooms = (app.project_manager.selected_project.property_type === "Commercial") ? app.RoomTypes.Commercial : app.RoomTypes.Residential;

		if (property_rooms[this.type]) {
			return property_rooms[this.type];

		} else {
			//not found?
			console.log('Room type ("' + this.type + '") not found in property type ("' + app.project_manager.selected_project.property_type + '"). Defaulting to "' + this.default_room_type + '"');
			return property_rooms[this.default_room_type];
		}
	},

	get_all_assets_of_type: function(type) {
		var assets = [];
		for (var i in this.assets) {
			var asset = this.assets[i];
			if (asset.type === type) {
				assets.push(asset);
			}
		}

		return assets;
	},

	get_closest_light: function() {
		//gets closest light closest to the top left corner of the room
		var closest_light = null,
		    shortest_dist = -1,
		    start_point = this.path.bounds.getTopLeft();

		for (var i in this.lights) {
			var light = this.lights[i],
			    dist = start_point.getDistance(light.path.bounds.center);

			if ((dist < shortest_dist) || (shortest_dist == -1)) {
				shortest_dist = dist;
				closest_light = light;
			}
		}

		return closest_light;
	},

	draw_first_light_distance_lines: function() {
		this.first_light = this.get_closest_light();

		if (this.first_light === null) {
			return;
		}

		//draw light's wall distance lines...
		this.first_light.draw_wall_distance_lines(this);

		//find next closest light....
		if (this.get_lights_count() > 1) {
			var next_light_point,
			    closest = this.first_light.find_nearest_lights(10, this, 'y', true);

			//if we don't have a sibling light on the y axis...
			if (closest.y_point === null) {
				//look on x...
				closest = this.first_light.find_nearest_lights(10, this, 'x', true);
				if (closest.x_point !== null) {
					next_light_point = closest.x_point;
				}

			} else {
				next_light_point = closest.y_point;
			}

			if (next_light_point) {
				//if we have a light sibling on the same x OR y, draw line...
				var d3 = new app.DistanceLine(next_light_point, this.first_light.path.bounds.center);
				this.first_light_distance_lines.push(d3);
				d3.draw();
			}
		}
	},

	remove_first_light_distance_lines: function() {
		for (var i in this.first_light_distance_lines) {
			this.first_light_distance_lines[i].remove();
		}

		if (this.first_light) {
			this.first_light.remove_wall_distance_lines();
		}
	},

	hide_first_light_distance_lines: function() {
		for (var i in this.first_light_distance_lines) {
			this.first_light_distance_lines[i].remove();
		}

		if (this.first_light) {
			this.first_light.hide_wall_distance_lines();
		}
	},

	get_closest_point_on_wall_by_axis: function(point, axis) {
		//var start_axis_point = (axis == "x") ? point.x : point.y;
		var start_other_axis_point = (axis == "x") ? point.y : point.x,
		    wall_axis_point1 = (axis == "x") ? this.path.bounds.x : this.path.bounds.y,
		    wall_axis_point2 = (axis == "x") ? this.path.bounds.width + this.path.bounds.x : this.path.bounds.height + this.path.bounds.y,

            wall_1_point = (axis == "x") ? new Point(wall_axis_point1, start_other_axis_point) : new Point(start_other_axis_point, wall_axis_point1),
		    wall_1_dist = point.getDistance(wall_1_point),

		    wall_2_point = (axis == "x") ? new Point(wall_axis_point2, start_other_axis_point) : new Point(start_other_axis_point, wall_axis_point2),
		    wall_2_dist = point.getDistance(wall_2_point);

		//the -1 is to preferentially choose the left wall if the values are really close
		return ((wall_1_dist - 1) <= wall_2_dist) ? wall_1_point : wall_2_point;
	},

	draw_snap_lines_for_light: function(drag_light) {
		app.snap_manager.remove_lines();
		var tolerance = (app.designer.room_scale * 0.2),
		    result = drag_light.find_nearest_lights(tolerance, this);

		app.snap_manager.draw_lines(result, drag_light.path.bounds.center);
	},

	/*has_overlapped: function() {
		//whether this room overlaps any other rooms

		// Note: this method doesn't work
		// The topLeft.x of the room is the exact same as the topRight.x of the room (to the right).
		// this still counts as an overlap :(

		// top get around this we would either need to implement our own overlap test (check point in bounds),
		// and minus a bit.

		//for each segment in the path...
		for(var s in this.path.segments) {
			var segment_point = this.path.segments[s].point;

			//see if it overlaps any other room...
			for(var r in app.designer.rooms) {
				var room = app.designer.rooms[r];
				if(room.id === this.id) {
					continue;
				}

				//room.path.setStrokeWidth(0.01);
				var test_point = new Point((segment_point.x + 0.1),(segment_point.y + 0.1));

				if(room.path.contains(test_point)) {
					var c = new Path.Circle(test_point, 1);
					c.fillColor = "blue";

					return true;
				}
			}
		}

		return false;
	},*/

	export: function() {
		var room = {
			id: this.id,
			name: this.name,
			display_name : this.display_name,
			type: this.type,
			//circuit: (this.circuit == null) ? '' : this.circuit.id,
			circuit: this.circuit.id,
			color_temp: this.color_temp,
			reflectivity: this.reflectivity,
			width: this.get_width(),
			height: this.get_height(),
			x: parseFloat(this.path.bounds.x).toFixed(4),
			y: parseFloat(this.path.bounds.y).toFixed(4),
			stroke_width: this.base_style.strokeWidth,
			segments: this.export_segments(),
			recommended_lux: this.recommended_lux,
			recommended_workplane_lux: this.recommended_workplane_lux,
			recommended_lumens: this.recommended_lumens,
			recommended_wattage: this.recommended_wattage,
			recommended_wattage_sqm: this.recommended_wattage_sqm,
			reached_lux: this.reached_lux,
			reached_workplane_lux: this.reached_workplane_lux,
			reached_lumens: this.reached_lumens,
			reached_wattage: this.reached_wattage,
			reached_wattage_sqm: this.reached_wattage_sqm
		};

		room.assets = [];
		$.each(this.assets, function(i, asset) {
			//skip lights and light switches...
			if (!asset.is_light() && !asset.is_light_switch()) {
				room.assets.push(asset.export());
			}
		});

		room.lights = [];
		$.each(this.lights, function(i, light) {
			room.lights.push(light.export());
		});

		room.light_switches = [];
		$.each(this.light_switches, function(i, light_switch) {
			room.light_switches.push(light_switch.export());
		});

		return room;
	},

	import_assets: function(assets) {
		var self = this;
		$.each(assets, function(i, data) {
			var asset_class = app.designer.get_asset_class(data.type);
			if (asset_class) {
				var asset = new asset_class(data);
				asset.room = self;
				self.assets[asset.id] = asset;
			}

			if (app.has_furniture === false) {
				app.has_furniture = true;
			}
		});
	},

	import_lights: function(lights) {
		var self = this;
		$.each(lights, function(i, data) {
			//var light_class = app.designer.get_asset_class(data.type);
			//light_class = 'Light';
			var light_class = app.Light,
			    has_circuit = (app.designer.circuits[data.circuit] !== undefined);

			if (light_class && has_circuit) {
				var light = new light_class(data);
				light.room = self;

				//add to lights & asset collections...
				self.lights[light.id] = light;
				self.assets[light.id] = light;

				if (app.has_lights === false) {
					app.has_lights = true;
				}

			}
		});
	},

	import_light_switches: function(light_switches) {
		var self = this;
		$.each(light_switches, function(i, data) {
			var light_switch = new app.Asset.LightSwitch(data);
			light_switch.room = self;

			//add to light_switches & asset collections...
			self.light_switches[light_switch.id] = light_switch;
			self.assets[light_switch.id] = light_switch;
		});
	},

	remove: function() {
		app.ui.pause_rendering();

		this._super();

		app.designer.square_meters -= this.square_meters;
		app.designer.recommended_lumens -= this.recommended_lumens;
		app.designer.recommended_wattage -= this.recommended_wattage;
		app.designer.reached_lumens -= this.reached_lumens;
		app.designer.reached_lux -= this.reached_lux;
		app.designer.reached_workplane_lux -= this.reached_workplane_lux;
		app.designer.reached_wattage -= this.reached_wattage;
		app.clear_status();

		this.path.remove();
		$.each(this.assets, function(i, asset) {
			asset.remove();
		});

		$.each(this.light_switches, function(i, asset) {
			asset.remove();
		});

		this.remove_first_light_distance_lines();

		//if (this.circuit != null) {
			delete app.designer.circuits[this.circuit.id];
		//}
		delete app.designer.rooms[this.id];

		this.pub_with_type("remove");

		app.ui.resume_rendering();
		app.ui.draw();
	},

	get_layer: function() {
		return app.designer.layers.rooms;
	}
});