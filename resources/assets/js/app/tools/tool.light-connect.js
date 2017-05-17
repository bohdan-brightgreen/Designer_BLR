/**
 *	Tool light.connect
 *	- Connect one light circuit to another
 *  - Connect a light switch to a circuit (as the primary)
 *  - Connecto one light switch to another (as the secondary)
 */

var light_con = new (Tool.extend({
	name: 'light.connect',
	guide: null,
	capture_mouse: true,
	from_switch: null,
	to_switch: null,
	from_light: null,
	to_light: null,

	is_connecting_circuits: function() {
		//if we have drawn from a light to a light, and they are on different circuits
		return (this.from_light && this.to_light && this.from_light.circuit !== this.to_light.circuit);
	},

	is_connecting_primary_switch: function() {
		//if we have drawn from a switch to a switch
		return (this.from_switch && this.to_light);
	},

	is_connecting_secondary_switch: function() {
		//if we have drawn from a switch to a switch, and the two switch is a primary
		return (this.from_switch && this.to_switch);
	}
}))();


light_con.on_activate = function(params) {
	app.designer.set_cursor('crosshair', true);
	app.pub('tool_activate');
	app.pub('tool_' + this.name + '_activate');
};

light_con.onMouseDown = function(event) {
	this.guide =  new Path();
	this.guide.strokeColor = '009933';
	this.guide.strokeWidth = '3';
	this.guide.ignore_events = true;

	this.guide.add(new Point(event.point.x, event.point.y));
	this.guide.add(new Point(event.point.x, event.point.y));
};

light_con.onMouseDrag = function(event) {
	if (this.guide) {
		this.guide.lastSegment.point = {x: event.point.x- 4, y: event.point.y - 4 };
	}
};

light_con.onMouseUp = function(event) {
	if (!this.guide) {
		return;
	}

	this.guide.remove();

	//if connecting one circuit to the other....
	if (this.is_connecting_circuits()) {
		//merge circuits....
		this.from_light.circuit.merge(this.to_light.circuit);

	} else if (this.is_connecting_primary_switch()) {
		var previous_primary_switch = this.to_light.circuit.primary_switch;

		//remove secondary circuit connections from new primary switch...
		this.from_switch.remove_from_secondary_circuits();

		//remove secondary switches connections from circuit...
		this.to_light.circuit.remove_secondary_switches();

		//swap primary to new switch...
		this.to_light.circuit.swap_primary_switch(this.from_switch);
		this.from_switch.add_circuit(this.to_light.circuit);
		previous_primary_switch.remove_circuit(this.to_light.circuit);

		this.from_switch.redraw_all_circuits();
		previous_primary_switch.redraw_all_circuits();

	} else if (this.is_connecting_secondary_switch()) {
		//link every circuit the to_switch is a primary for, as secondary for the from_switch

		//test to and from to as it can go either direction (but always to primary)
		if (this.from_switch.is_a_primary() && !this.to_switch.is_a_primary()) {
			var temp_swap_switch = this.from_switch;
			this.from_switch = this.to_switch;
			this.to_switch = temp_swap_switch;
		}

		for (var i in this.to_switch.circuits) {
			var circuit = this.to_switch.circuits[i];
			if (circuit.primary_switch === this.to_switch) {
				this.from_switch.add_circuit(circuit);
				circuit.add_secondary_switch(this.from_switch);
			}
		}

		this.to_switch.redraw_connections();
		this.to_switch.redraw_all_circuits();
		this.from_switch.redraw_all_circuits();
	}

	if (this.to_light) {
		this.to_light.circuit.cancel_connection();
	}

	if (this.from_light) {
		this.from_light.circuit.cancel_connection();
	}

	this.from_switch = null;
	this.to_switch = null;
	this.from_light = null;
	this.to_light = null;
};


light_con.on_deactivate = function(params) {
	app.designer.reset_cursor('crosshair');
	app.pub('tool_deactivate');
	app.pub('tool_' + this.name + '_deactivate');
};

app.designer.tools[light_con.name] = light_con;