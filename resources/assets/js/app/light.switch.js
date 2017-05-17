/**
 *	Class app.Asset.LightSwitch
 *	Represents a light switch for a circuit (in a room)
 *
 *	Note: at the end of this file is LightSwitchDimmer and LightSwitchTouch (which inherits this class)
 *
 */
app.Asset.LightSwitch = app.Asset.extend({
	circuits: null,
	connections: null,
	is_dragging: null,

	init: function(data) {
		this.circuits = {};
		if (data.circuits) {
			for (var i=0; i<data.circuits.length; i++) {
				var circuit = app.designer.circuits[data.circuits[i]];
				if (circuit) {
					this.circuits[circuit.id] = circuit;
				}
			}
		}

		this.is_dragging = false;
		this.connections = {};
		this._super(data);

		if (data && data.id) {
			this.id = data.id;
		}

		//persist in global scope (as circuits *can* span rooms we need to keep track
		//of switches at a higher level than rooms...
		app.designer.light_switches[this.id] = this;
	},

	create_path: function(data) {
		if (!data.type) {
            this.type = (this.switch_type) ? ('light-switch-' + this.switch_type) : 'light-switch';

		} else {
			this.type = data.type;
		}

		this.width = (data.width) ? data.width : 17;
		this.height = (data.height) ? data.height : 30;
		this.rotation_step = 45;
		this.sticky = true;
		this.width_meters = 0.12;

		this._super(data);
	},

	add_circuit: function(circuit) {
		this.circuits[circuit.id] = circuit;
	},

	redraw_connections: function() {
		this.hide_connections();
		this.connections = {};

		for (var i in this.circuits) {
			var circuit = this.circuits[i];
			this.redraw_connection(circuit);
		}

		this.hide_connections();
	},

	redraw_connection: function(circuit) {
		this.hide_connection(circuit);
		var lights_count = circuit.get_items_count();

		if (lights_count > 0) {
			//if primary switch - connect to circuit...
			var path = (this === circuit.primary_switch) ? this.connect_to_closest_light(circuit) : this.connect_to_primary_switch(circuit);

			this.connections[circuit.id] = path;
			this.hide_connection(circuit);
		}
	},

	connect_to_closest_light: function(circuit) {
		var override_ignore = false;

		//if there are only wall lights - override ignore to find closes light (NOT ignoring flush wall lights)
		if (circuit.flush_wall_light_count === circuit.get_items_count()) {
			override_ignore = true;
		}

		var closest_light = circuit.get_closest_item_to_point(this.path.bounds.center, override_ignore);
		var thru = circuit.get_connection_through_point(this, closest_light);
		var path = new Path.Arc(closest_light.path.bounds.center, thru, this.path.bounds.center);

		path.strokeColor = app.colours.main;
		path.dashArray = [6, 6];
		path.opacity = 0.8;
		path.ignore_events = true;
		path.ld_type = 'circuit-outline';

		closest_light.wire_count++;

		path.onClick = $.proxy(function() { this.on_editable_connection_click(path, circuit); }, this);
		return path;
	},

	connect_to_primary_switch: function(circuit) {
		var primary_switch = circuit.primary_switch;
		if (!primary_switch) {
			return null;
		}

		var thru = circuit.get_connection_through_point(this, primary_switch),
		    path = new Path.Arc(circuit.primary_switch.path.bounds.center, thru, this.path.bounds.center);

		path.strokeColor = 'blue';
		path.dashArray = [6, 6];
		path.opacity = 0.8;
		path.ignore_events = true;
		path.ld_type = 'circuit-outline';
		path.onClick = $.proxy(function() {
            this.on_editable_connection_click(path, circuit);
        }, this);

		return path;
	},

	show_connection: function(circuit, redraw) {
		if (this.is_dragging) {
			return;
		}

		var connection = this.connections[circuit.id];

		if (connection) {
			this.hide_connection(circuit);

			if (redraw) {
				this.redraw_connection(circuit);
			}

			if (connection.layer === null) {
				app.designer.layers.circuits.addChild(connection);
			}
		}
	},

	set_connection_editable: function(circuit, editable) {
		var connection = this.connections[circuit.id];

		if (!connection) {
			return;
		}

		if (editable) {
			connection.strokeWidth = 3;
			connection.ignore_events = false;
			connection.onMouseEnter = function(event) {
                connection.strokeColor = 'red';
            };
			connection.onMouseLeave = function(event) {
                connection.strokeColor = app.colours.main;
            };

		} else {
			connection.strokeWidth = 1;
			connection.ignore_events = true;
			connection.onMouseEnter = null;
			connection.onMouseLeave = null;
		}
	},

	on_editable_connection_click: function(connection, circuit) {
		if (confirm('Are you sure you wish to remove this switch connection?')) {
			this.remove_circuit(circuit);
			circuit.remove_item_switch(this);
		}
	},

	show_connections: function(redraw) {
		if (this.is_dragging) {
			return;
		}

		if (redraw) {
			this.redraw_connections();
		}

		for (var i in this.connections) {
			var connection = this.connections[i];

			if (connection && connection.layer === null) {
				app.designer.layers.circuits.addChild(connection);
			}
		}

		app.ui.draw();
	},

	hide_connection: function(circuit) {
		var connection = this.connections[circuit.id];

		if (connection) {
			connection.remove();
			app.ui.draw();
		}
	},

	hide_connections: function() {
		for (var i in this.connections) {
			this.connections[i].remove();
		}

		app.ui.draw();
	},

	remove_circuit: function(circuit) {
		if (this.circuits[circuit.id]) {
			this.hide_connection(circuit);
			delete this.circuits[circuit.id];
			delete this.connections[circuit.id];
		}
	},

	redraw_all_circuits: function() {
		for (var i in this.circuits) {
			this.circuits[i].show_connections(true);
		}
	},

	is_a_primary: function() {
		for (var i in this.circuits) {
			if (this.circuits[i].primary_switch === this) {
				return true;
			}
		}

		return false;
	},

	on_mouse_enter: function(event) {
		this._super(event);

		if (app.designer.is_connect_active()) {
			this.path.strokeColor = 'blue';
			this.show_connections();
		}
	},

	on_mouse_leave: function(event) {
		this._super(event);

		if (app.designer.is_connect_active()) {
			this.path.strokeColor = this.base_style.strokeColor;
			this.path.strokeColor.alpha  = 0.01;

			this.hide_connections();
		}
	},

	on_mouse_down: function(event) {
		this._super(event);

		if (app.designer.is_connect_active()) {
			app.designer.active_tool.from_switch = this;
		}
	},

	on_mouse_up: function(event) {
		this._super(event);

		if (app.designer.is_connect_active() && app.designer.active_tool.from_switch) {
			app.designer.active_tool.to_switch = this;
		}
	},

	on_mouse_drag: function(event) {
		this._super(event);

		if (!this.is_resizing && !app.designer.is_busy()){
			this.hide_connections();
			this.is_dragging = true;
		}
	},

	move_finish: function() {
		this._super();
		this.is_dragging = false;
		this.redraw_all_circuits();
	},

	reset: function () {
		this.hide_connections();

		for (var i in this.circuits) {
			this.circuits[i].remove_item_switch(this);
		}

		this.connections = {};
		this.circuits = {};

		delete this.room.light_switches[this.id];
		delete this.room.assets[this.id];
		this.room = null;
	},

	remove_from_secondary_circuits: function() {
		for (var i in this.circuits) {
			var circuit = this.circuits[i];
			if (circuit.primary_switch !== this) {
				circuit.remove_item_switch(this);
				this.remove_circuit(circuit);
			}
		}
	},

	export: function() {
		var asset = this._super();

		asset.circuits = [];

		for (var i in this.circuits) {
			var circuit = this.circuits[i];
			asset.circuits.push(circuit.id);
		}

		return asset;
	},

	delete_asset: function() {
		if (!confirm('Are you sure you wish to permentantly delete this ' + this.class + '?')) {
			return false;
		}

		var swap_success = true;

		//for each circuit, if we are the primary_switch try to swap...
		for (var i in this.circuits) {
			var circuit = this.circuits[i];

			if (circuit.primary_switch === this && circuit.get_items_count() > 0) {
				//check we could find a replacement primary switch...
				if (!circuit.swap_primary_switch()) {
					swap_success = false;
				}
			}
		}

		if (!swap_success) {
			alert('Cannot delete light switch - you must have at least one switch for this circuit');
			return false;
		}

		this.remove();
		this.redraw_all_circuits();
	},

	remove: function() {
		this.hide_connections();

		delete app.designer.light_switches[this.id];
		delete this.room.light_switches[this.id];
		delete this.room.assets[this.id];

		for (var i in this.circuits) {
			this.circuits[i].remove_item_switch(this);
		}

		this._super();
	},

	hide: function() {
		this.path.visible = false;
		this.raster.visible = false;
		app.ui.draw();
	},

	show: function() {
		this.path.visible = true;
		this.raster.visible = true;
		app.ui.draw();
	}
});



//Light switch dimmer asset (extends light_switches)
app.Asset.LightSwitchDimmer = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.switch_type = 'dimmer';
		this._super(data);
	}
});

//Light switch touch asset (extends light_switches)
app.Asset.LightSwitchTouch = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.switch_type = 'touch';
		this._super(data);
	}
});

/* -------------- HPM -------------- */

/*app.Asset.LightSwitchHpmStandard = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 17;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.DimmerHpmExcel = app.Asset.LightSwitchDimmer.extend({
	create_path: function(data) {
		this.width = 17;
		this.height = 30;
		this._super(data);
	}
});*/

app.Asset.LightSwitchHpmSunshine = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 30;
		this.height = 19;
		this._super(data);
	}
});

app.Asset.LightSwitchHpmPush4 = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 19;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.LightSwitchHpmMattSilver = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 30;
		this.height = 19;
		this._super(data);
	}
});

app.Asset.LightSwitchHpmPush = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 17;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.DimmerHpmArchitectural = app.Asset.LightSwitchDimmer.extend({
	create_path: function(data) {
		this.width = 18;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.DimmerHpmComo = app.Asset.LightSwitchDimmer.extend({
	create_path: function(data) {
		this.width = 18;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.DimmerHpmLinea = app.Asset.LightSwitchDimmer.extend({
	create_path: function(data) {
		this.width = 30;
		this.height = 18;
		this._super(data);
	}
});

/* -------------- Clipsal -------------- */

app.Asset.DimmerClipsal2000 = app.Asset.LightSwitchDimmer.extend({
	create_path: function(data) {
		this.width = 18;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.LightSwitchClipsalClassicC2000 = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 18;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.LightSwitchClipsalEclipseSl2000 = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 18;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.LightSwitchClipsalModena8000 = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 30;
		this.height = 18;
		this._super(data);
	}
});

app.Asset.LightSwitchClipsalSaturn = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 18;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.LightSwitchClipsalSlimlineSc2000 = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 18;
		this.height = 30;
		this._super(data);
	}
});

app.Asset.LightSwitchClipsalStrato8000 = app.Asset.LightSwitch.extend({
	create_path: function(data) {
		this.width = 30;
		this.height = 18;
		this._super(data);
	}
});

// Lucy

app.Asset.LucyTouch = app.Asset.LightSwitch.extend({
    create_path: function(data) {
        this.width = 18;
        this.height = 30;
        this._super(data);
    }
});

app.Asset.LucyAct = app.Asset.LightSwitch.extend({
    create_path: function(data) {
        this.width = 18;
        this.height = 30;
        this._super(data);
    }
});

app.Asset.LucyThink = app.Asset.LightSwitch.extend({
    create_path: function(data) {
        this.width = 30;
        this.height = 18;

        this._super(data);
    }
});