/**
 *	Class app.Light
 *	Represents a light
 *
 */
app.Light = app.Asset.extend({
	beam: null,
	circuit: null,
	group: null,
	is_connecting: null,
    display_colour: null,
	beam_width: null,
	color: null,
	height_off_floor: null,
    default_height_off_floor: 2.7,
	//is_controls_light: false,
	wire_count: null,
	max_wires: 3,
	wires: null,
	product_info: null,
	is_wall_light: null,
	is_strip_light: null,
    width: 16,
    height: 16,

	init: function(data) {
		//merge supplied data into light...
		_.extend(this, data);

		// is it strip light
        this.is_strip_light = (data.code == '120S-LM-3K-120-C');
		
		if (!data.type) {
			this.type = this.code.toLowerCase();
			data.type = this.type;
		}

        if (!data.display_colour) {
            this.display_colour = app.lightColours.getLightColour(data.code);

        } else {
            this.display_colour = app.lightColours.setLightColour(data.code, data.display_colour);
        }

		this.beam_width = 30;
		this.wall_distance_from_center = true;
		this.in_group = (data.group !== undefined);
		this.initializing = true;
		this._super(data);

		this.sticky = (data.is_wall_light);

		//add the product info object
		if (data.product_info) {
			this.product_info = data.product_info;
		}

		//if wall light...
		if (this.sticky) {
            this.height_off_floor = data.height_off_floor ? data.height_off_floor : this.default_height_off_floor;
		}

		if (data.circuit) {
			app.designer.circuits[data.circuit].add_item(this);
		}

		if (data.group) {
			app.designer.light_groups[data.group].add_light(this);
		}

		this.is_connecting = false;
		this.initializing = false;
		this.wires = {};
	},

	create_path: function(data) {
		if (this.width_meters === null) {
			this.width_meters = 0.25;
		}

        this.rotation_step = 45;
		this._super(data);
	},

	set_rotation: function(rotation, from_group) {
		//remove current rotation, then rotate...
		this.rotate((0 - this.rotation) + rotation, from_group);
		this.rotation = rotation;

		if (this.rotation >= 360) {
			this.rotation = (this.rotation - 360);
		}
	},

	rotate: function(rotation, from_group) {
		if (this.group && !from_group) {
			var center = this.group.path.bounds.getCenter();
			this._rotate(rotation, center);

		} else {
			this._super(rotation);
		}
	},

	_rotate: function(rotation, center) {
		this.path.rotate(rotation, center);
		this.raster.rotate(rotation, center);
	},

	rotate_by: function(rotation) {
		if (this.group) {
			if (typeof this.group !== 'string') {
				this.group.rotate_by(rotation);
			}

		} else {
			this._rotate(rotation);
			this.rotation += rotation;
		}
	},

	move: function(x, y, force_move) {
		//if a single light - or calling from group...
		if (!this.group || force_move) {
			if (!this.group && app.designer.active_room) {
				app.designer.active_room.draw_snap_lines_for_light(this);
			}

			return this._super(x,y);

		} else {
			//move whole group...
			this.group.move(x, y, this);
		}
	},

	move_by: function(delta) {
		this._super(delta);
	},

	move_finish: function() {
		this._super();

		if (this.group) {
			this.group.move_finish(this);
		}

		/*if (this.room) {
			//this.room.remove_snap_lines();
		}*/

		this.circuit.show_connections(true);
	},

	on_mouse_enter: function(event) {
		if (app.is_dragging()) {
			return;
		}

		this._super(event);

		if (this.group) {
			this.group.hover_light = this;
		}

		if (app.designer.is_disconnect_active()) {
			this.circuit.show_connections();

			if (this.group) {
				this.group.invoke_on_lights('disconnect_hover');

			} else {
				this.disconnect_hover();
			}

		} else if (app.designer.is_connect_active()) {
			this.circuit.show_connections();

			//if from light specified...
			if (app.designer.active_tool.from_light || app.designer.active_tool.from_switch) {
				app.designer.active_tool.to_light = this;
			}

			//return;
		}
	},

	on_mouse_leave: function(event) {
		if (app.is_dragging()) {
			return;
		}

		//check if leaving onto the group outline for a string (to stop flicker)...
		if (this.group && this.group.type === 'string') {
			//run a hit test...
			var hitOptions = {
				segments: true,
				handles: false,
				stroke: true,
				fill: false,
				tolerance: 1.5
			};

			var hitResult = paper.project.hitTest(event.point, hitOptions);

			if (hitResult) {
				//if leaving onto group outline - ignore...
				if (hitResult.item.id === this.group.path.id) {
					return;
				}
			}
		}

		/*if(!app.designer.is_disconnect_active()) {
			app.designer.reset_cursor();
			return;
		}*/

		this._super(event);

		if (app.designer.is_disconnect_active()) {
			this.circuit.hide_connections();
			this.circuit.invoke_on_items('disconnect_unhover');

		} else if (app.designer.is_connect_active()) {
			//if from light selected...
			if (app.designer.active_tool.from_light) {
				if (app.designer.active_tool.from_light != this) {
					app.designer.active_tool.to_light = null;
				}

				//hide circuit if not same
				if (!app.designer.active_tool.from_light.circuit || (app.designer.active_tool.from_light.circuit !== this.circuit)) {
					this.circuit.hide_connections();
				}

			} else {
				app.designer.active_tool.to_light = null;
				this.circuit.hide_connections();
			}
		}
	},

	on_mouse_down: function(event) {
		if (event.event.button == 2) {
			this._super(event);
		}

		if (app.designer.is_disconnect_active()) {
			var previous_circuit = this.circuit;

			if (this.group) {
				this.group.disconnect();

			} else {
				this.disconnect();
			}

			previous_circuit.invoke_on_items('disconnect_unhover');
			this.circuit.invoke_on_items('disconnect_hover');

		} else if (app.designer.is_connect_active()) {
			//set light...
			app.designer.active_tool.from_light =  this;
			this.circuit.invoke_on_items('set_connecting');
		}
	},

	on_mouse_up: function(event) {
		if (app.designer.is_connect_active() || app.designer.is_disconnect_active()) {
			return;
		}

		this._super(event);

		//show controls after app.designer has handled mouse_up
		window.setTimeout($.proxy(function(){
			if (!this.selected) {
				this.set_active(true);
				view.draw();
			}
		}, this), 50);
	},

	cancel_connection: function() {
		this.cancel_connecting();
		this.connect_unhover();
	},

	set_connecting: function() {
		this.is_connecting = true;
	},

	cancel_connecting: function() {
		this.is_connecting = false;
	},

	disconnect: function(new_circuit) {
		var old_circuit = this.circuit;
		this.circuit.remove_item(this);

		if (!new_circuit) {
			new_circuit = app.designer.get_new_circuit();
		}

		new_circuit.add_item(this);
		var room = this.room;

		new_circuit.room = room;

		//if single light, refresh connections...
		if (!this.group) {
			room.refresh_circuits();

			old_circuit.redraw_connections();
			old_circuit.room.reconnect_light_switches();

			new_circuit.show_connections(true);
			new_circuit.room.reconnect_light_switches();
		}
	},

	disconnect_hover: function() {
		this.path.strokeColor = 'red';
	},

	disconnect_unhover: function() {
		this.path.strokeColor = null;
	},

	connect_hover: function() {

	},

	connect_unhover: function() {

	},

	select: function(event) {
		this._super();

		var ctrlKey = (event && event.event && event.event.ctrlKey);

		if (this.group) {
			if (ctrlKey) {
				this.group.single_selected = true;

			} else {
				this.group.single_selected = false;
				this.path.strokeColor = null;
				this.group.select();
			}
		}
	},

	unselect: function() {
		this._super();

		if (this.group) {
			this.path.strokeColor = null;
			this.group.unselect(this.current_style);
		}
	},

	set_active: function(active) {
		this._super(active);

		this.raster.opacity = 1;

		if (this.group) {
			this.path.strokeColor = null;
			this.group.set_active(active, this);
		}
	},

	remove: function(from_group, leave_circuit) {
		//if hasn't dropped in room yet (still)
		if (!this.room && !this.circuit) {
			this._super();
			return;
		}

		if (this.circuit) {
			this.circuit.remove_item(this, leave_circuit);
		}

		//remove whole group...
		if (this.group && !from_group && !this.group.single_selected) {
			this.group.unselect();
			this.group.remove();
			this.circuit.show_connections(true);
			this.circuit.room.reconnect_light_switches();
            //app.lightColours.removeUnusedLights();
			return;

		} else if (this.group && this.group.single_selected) {
			//else remove single light from group...
			this.group.remove_light(this);

			if (this.group.type == 'string') {
				this.group.rows--;
			}
		}

		this._super();

		if (this.group) {
			this.group.single_selected = false;
			this.group.refresh_outline();

		} else {
			this.circuit.show_connections(true);
			this.circuit.room.reconnect_light_switches();
		}
	},

	set_custom_light_data: function(code, color_temperature, lumens, wattage) {
		if (this.group) {
			this.group.set_custom_light_data(code, color_temperature, lumens, wattage);

		} else {
			this.code = code;
			this.color_temperature = color_temperature;
			this.lumens = lumens;
			this.wattage = wattage;
		}
	},

	get_custom_light_data: function() {
		return {
			type: this.type,
			code: this.code,
			color_temperature: this.color_temperature,
			lumens: this.lumens,
			wattage: this.wattage,
			is_custom: this.is_custom
		};
	},

	change_type: function(change_data) {
		this.path.strokeWidth = 0.001;
		this.is_custom = false;

		var light_data = this.export();
		_.extend(light_data, change_data);

		// set the position of new lights

		delete light_data.width;
		delete light_data.height;
		delete light_data.original_width;
		delete light_data.original_height;
		delete light_data.segments;
		delete light_data.stroke_width;
		delete light_data.width_meters;
		delete light_data.height_meters;
		delete light_data.original_width_meters;
		delete light_data.original_height_meters;
        delete light_data.display_colour;

		var room = this.room;
		var circuit = this.circuit;
		var new_light = new app.Light(light_data);

		//note - instead of calling room.remove_asset,
		//group.remove_light etc - we just re-map the arrays
		//and delete the raster of the previous light

		if (circuit) {
			new_light.circuit = this.circuit;
			this.circuit.items[this.id] = new_light;
		}

		room.assets[this.id] = new_light;
		room.lights[this.id] = new_light;
		new_light.room = this.room;

		if (!this.group) {
			new_light.select();

		} else {
			this.group.lights[this.id] = new_light;
			new_light.group = this.group;
		}

		this.remove_wall_distance_lines();
		this.path.remove();
		this.raster.remove();

		if (!this.group) {
			new_light.room.refresh_reached(true);
			new_light.room.refresh_status();
		}

		//this.remove(true);

        new_light.x = light_data.x;
        new_light.y = light_data.y;
		/*new_light.x = change_data.centerX;
		new_light.y = change_data.centerY;
		new_light.path.bounds.centerX = change_data.boundsCenterX;
		new_light.path.bounds.centerY = change_data.boundsCenterY;*/

		return new_light;
	},

	set_wall_light_height: function(height) {
		this.height_off_floor = height;
	},

	find_nearest_lights: function(tolerance, room, axis, allow_same_group) {
		var to_point = new Point(this.path.bounds.center.x, this.path.bounds.center.y),
		    assets = (room) ? room.lights : this.room.lights,
		    compare_points = ['center'],
		    exclusions = [
			    $.proxy(function(asset){
                    return (asset.id === this.id);
                }, this)
		    ];

		if (!axis) {
			axis = 'xy';
		}

		if (allow_same_group !== true) {
			exclusions.push($.proxy(function(asset) {
                return (this.group !== null && asset.group === this.group);
            }, this));
		}

		return app.snap_manager.find_nearest_asset_points(to_point, axis, assets, tolerance, compare_points, exclusions);
	},

	get_hover_status: function() {

	},

	delete_asset: function(event) {
		if (this.group && !this.group.single_selected) {
			if (confirm('Are you sure you wish to permanently delete all these lights?')) {
				this.remove();
			}

		} else {
			this._super();
			this.circuit.show_connections(true);
			this.circuit.room.reconnect_light_switches();
		}

        app.lightColours.removeUnusedLights();
	},

	export: function() {
		var asset = this._super();

		asset.code = this.code;
		asset.is_custom = this.is_custom;
		asset.fascia_color = this.fascia_color;
		asset.color_temperature = this.color_temperature;
		asset.beam_angle = this.beam_angle;
		asset.family = this.family;
		asset.name = this.name;
		asset.lumens = this.lumens;
		asset.wattage = this.wattage;
		asset.is_wall_light = this.is_wall_light;
        asset.display_colour = this.display_colour;

		if (this.height_off_floor) {
			asset.height_off_floor = this.height_off_floor;
		}

		if (this.circuit) {
			asset.circuit = this.circuit.id;
		}

		if (this.group) {
			asset.group = this.group.id;
		}

		return asset;
	},

	get_layer: function() {
		return app.designer.layers.lights;
	}
});