/**
 *	Class app.Circuit
 *	Represents a collection of one or more items
 *
 */
app.Circuit = Class.extend({
    items: null,
    room: null,
    connections: null,
    outline: null,
    primary_switch: null,
    secondary_switches: null,
    wire_color: app.colours.main,

    flush_wall_lights: null,
    flush_wall_light_count: null,

    init: function(data, room) {
        this.id = (data && data.id) ? data.id : generate_guid();

        if (room) {
            this.room = room;

        } else if (data && data.room) {
            //room id on import
            this.room = data.room;
        }

        this.items = {};
        this.connections = {};

        //Note - on import primary & secondary switches are not objects,
        //just their id's. They are populateds on end of room.init
        if (data && data.primary_switch) {
            this.primary_switch = data.primary_switch;
        }

        this.secondary_switches = {};
        if (data && data.secondary_switches) {
            this.secondary_switches = data.secondary_switches;
        }
    },

    merge: function(with_circuit) {
        this.hide_connections();
        with_circuit.hide_connections();

        for (var id in this.items) {
            with_circuit.add_item(this.items[id]);
        }

        //if not the rooms main circuit - remove...
        if (this.room.circuit.id != this.id) {
            this.remove();
        }

        with_circuit.show_connections(true);
        with_circuit.room.reconnect_light_switches();

        var first_item = with_circuit.get_first_item();

        if (first_item) {
            first_item.room.refresh_circuits();

            //if not removed...
            if (this.room) {
                this.room.refresh_circuits();
            }
        }
    },

    cancel_connection: function(function_name) {
        for (var i in this.items) {
            this.items[i].cancel_connection();
        }
    },

    invoke_on_items: function(function_name) {
        for (var i in this.items) {
            this.items[i][function_name]();
        }
    },

    add_item: function(item) {
        if (!this.contains_item(item)) {
            this.items[item.id] = item;

            //if item was in another circuit (that wasn't this)...
            if (item.circuit !== null && typeof item.circuit !== "string" && item.circuit.id !== this.id) {
                item.circuit.remove_item(item);
            }

            item.circuit = this;
        }
    },

    /*add_group: function(group) {
        if(!this.contains_group(group)) {
            this.groups[group.id] = group;
            group.circuit = this;

            //add group lights to circuit lights...
            for (var light_id in group.lights) {
                var light = group.lights[light_id];
                this.add_light(light);
                this.room.add_asset(light);
            }
        }
     },*/

    contains_item: function(item) {
        return (this.items[item.id] !== undefined);
    },

    remove_item: function(item, leave_circuit) {
        delete this.items[item.id];

        //if no items left...
        if (this.get_items_count() === 0 && !leave_circuit) {
            this.remove();
        }
    },

    get_items_count: function() {
        var count = 0;

        for (var k in this.items) {
            if (this.items.hasOwnProperty(k)) {
                count++;
            }
        }
        return count;
    },

    get_first_item: function() {
        var item = this.get_closest_item_to_point(this.room.path.bounds.topLeft);

        return (item) ? item : null;
    },

    show_connections: function(redraw) {
        if (app.ui.is_paused()) {
            return;
        }

        if (this.get_items_count() === 0) {
            this.hide_connections();
            return;
        }

        if (redraw) {
            this.redraw_connections();
        }

        if (this.outline && this.outline.length > 0 && this.outline[0].layer === null) {
            app.designer.layers.circuits.addChildren(this.outline);
        }

        this.show_switches();
        app.ui.draw();
    },

    hide_connections: function() {
        if (this.outline && this.outline.length > 0 && this.outline[0].layer) {
            for (var i in this.outline) {
                this.outline[i].remove();
            }
            app.ui.draw();
        }

        this.hide_switches();
    },

    show_switches: function() {
        if (this.primary_switch) {
            this.primary_switch.show_connection(this);
        }

        for (var i in this.secondary_switches) {
            var secondary_switch = this.secondary_switches[i];
            if (secondary_switch) {
                secondary_switch.show_connection(this);
            }
        }
    },

    hide_switches: function() {
        if (this.primary_switch) {
            this.primary_switch.hide_connection(this);
        }

        for (var i in this.secondary_switches) {
            var secondary_switch = this.secondary_switches[i];
            if (secondary_switch) {
                secondary_switch.hide_connection(this);
            }
        }
    },

    redraw_connections: function() {
        //reset existing links...
        this.reset_connections();
        this.hide_connections();

        var seperately_wire_wall_lights = this.prepare_wall_lights();

        //loop through every light, keep track of closest (in array)
        //2d array to hold the closest unwired connections path through the circuit
        this.simple_connection_path = [];

        //find simple path through the circuit (connecting every unconnected light)
        this.derive_simple_connection_path();

        this.outline = [];

        //loop through every proposed connection...
        for (var i in this.simple_connection_path) {
            var connection = this.simple_connection_path[i],
                from_item = connection[0],
                to_item = connection[1];

            //if not first connection
            if (i > 0) {
                //check if there is a "better" light for the to light...
                //one that is alreadt connected to the circuit - but hasn't exceeded max_lights
                from_item = this.get_closest_item_to_item(to_item, 'wired');
            }

            //connect lights...
            this.connect_items(from_item, to_item);
        }

        //reconnect to switches...
        this.reconnect_switches();

        //rewire (flush) wall lights....
        if (seperately_wire_wall_lights) {
            this.connect_flush_wall_lights();
        }

        this.hide_connections();
        app.ui.draw();
    },

    reconnect_switches: function() {
        if (this.primary_switch) {
            this.primary_switch.redraw_connection(this);
        }

        //and secondary switches...
        for (var i in this.secondary_switches) {
            var secondary_switch = this.secondary_switches[i];
            if (secondary_switch) {
                secondary_switch.redraw_connection(this);
            }
        }
    },

    connect_items: function(from_item, to_item) {
        var through_point = this.get_connection_through_point(from_item, to_item),
            path = new Path.Arc(from_item.path.bounds.center, through_point, to_item.path.bounds.center);

        path.ignore_events = true;
        path.strokeColor = this.wire_color;
        path.dashArray = [6, 6];
        path.opacity = 0.8;
        this.outline.push(path);

        //persist wires...
        from_item.wire_count++;
        to_item.wire_count++;
        from_item.wires[to_item.id] = true;
        to_item.wires[from_item.id] = true;
    },

    prepare_wall_lights: function() {
        //wall lights on the same wall must be at the end of a wire connection (branch).
        //look at every wall light that is flush against a wall, and add to flush_wall_lights object for seperate wiring
        //return whether or not wall lights should be wired seperately
        this.flush_wall_lights = {};
        this.flush_wall_light_count = 0;
        var walls_with_wall_lights = 0;
        var circuit_lights = [];

        for (var i in this.items) {
            if (this.items[i].is_light()) {
                circuit_lights[i] = this.items[i];
            }
        }

        if (circuit_lights.length == 0) {
            return false;
        }

        //collect all wall lights on a same wall (walls = x, x2, y, y2)
        for (var i in circuit_lights) {
            var light = circuit_lights[i];
            light.ignore_connection = false;

            if (!light.is_wall_light) {
                continue;
            }

            //if its a group, make sure it's a string - and staight line
            if (light.group) {
                if (light.group.type !== 'string' || !light.group.is_straight_line()) {
                    continue;
                }
            }

            //check if on a wall...
            if (!light.sticky_wall) {
                continue;
            }

            if (!this.flush_wall_lights[light.sticky_wall]) {
                this.flush_wall_lights[light.sticky_wall] = [];
                walls_with_wall_lights++;
            }

            this.flush_wall_lights[light.sticky_wall].push(light);
            this.flush_wall_light_count++;
        }

        //find out how many remaining down lights there are...
        var downlight_count = (circuit_lights.length - this.flush_wall_light_count),
            seperately_wire_wall_lights = true;

        //if there are no downlights - do not wire seperately
        if (downlight_count === 0) {
            seperately_wire_wall_lights = false;

        } else if (downlight_count < (walls_with_wall_lights - 1)) {
            //if there are not enough down lights to support wall light brnches (due to max_wires) - do not wire seperately
            seperately_wire_wall_lights = false;
        }

        var light_sort = function(a, b) {
            var sort_axis = (axis === 'x') ? 'y' : 'x';
            return (a.path.bounds[sort_axis] < b.path.bounds[sort_axis]);
        };

        for (var key in this.flush_wall_lights) {
            var lights = this.flush_wall_lights[key],
                axis = key.substr(0,1);

            lights = lights.sort(light_sort);

            //if we are wiring wall lights seperatetly (after all down lights are connected)
            if (seperately_wire_wall_lights) {
                for (var l in lights) {
                    //ignore initial wiring
                    lights[l].ignore_connection = true;
                }
            }
        }

        //if not wiring seperately, reset...
        if (!seperately_wire_wall_lights) {
            this.flush_wall_lights = {};
            this.flush_wall_light_count = 0;
        }

        return seperately_wire_wall_lights;
    },

    connect_flush_wall_lights: function() {
        var previous_light;

        for (var i in this.flush_wall_lights) {
            var wall_lights = this.flush_wall_lights[i],
                closest_wall_light,
                closest_light,
                closest_distance = 0;

            previous_light = null;

            for (var l in wall_lights) {
                var light = wall_lights[l];

                if (previous_light) {
                    this.connect_items(previous_light, light);
                }

                //test closest light...
                var temp_closest_light = this.get_closest_item_to_item(light, 'wired');
                if (temp_closest_light) {
                    var distance = light.path.bounds.center.getDistance(temp_closest_light.path.bounds.center);

                    if (closest_distance === 0 || distance < closest_distance) {
                        closest_wall_light = light;
                        closest_light = temp_closest_light;
                        closest_distance = distance;
                    }

                } else {
                    //if no closest down light, and only one on this wall,
                    //connect to next wall light...
                    if (wall_lights.length === 1) {
                        temp_closest_light = this.get_closest_item_to_item(light, 'wired', true);

                        if (temp_closest_light) {
                            closest_wall_light = light;
                            closest_light = temp_closest_light;
                        }
                    }
                }

                previous_light = light;
            }

            if (closest_wall_light && closest_light) {
                this.connect_items(closest_wall_light, closest_light);
            }
        }
    },

    derive_simple_connection_path: function() {
        var count = (this.get_items_count() - this.flush_wall_light_count);

        //re connect all items....
        if (count > 1) {
            var item = this.get_first_item(),
                connecting = true,
                preferred_direction;

            while (connecting) {
                preferred_direction = null;

                var closest_item = this.get_closest_item_to_item(item);

                if (closest_item) {

                    this.simple_connection_path.push([item, closest_item]);
                    //persist connection path...
                    this.connections['from'][item.id] = true;
                    this.connections['to'][closest_item.id] = true;

                    item = closest_item;

                } else {
                    connecting = false;
                }
            }
        }
    },

    //method:	'unwired' find closest item that has no wires
    //			'wired'   find closest item that has at least one wire (but < item.max_wires)
    //override_ignore:  override ignore_connection
    get_closest_item_to_item: function(item, method, override_ignore) {
        var to_item,
            closest_item,
            closest_item_point,
            preferred_direction;

        if (!method) {
            method = 'unwired';
        }

        //if item in group - check for the best preferred connection direction,
        //vertical || horizontal - based off more cols or rows
        if (item.group) {
            preferred_direction = (item.group.cols > item.group.rows) ? 'horizontal' : 'vertical';
        }

        for (var i in this.items) {
            to_item = this.items[i];

            //if same item - keep looking...
            if (to_item == item) {
                continue;
            }

            //if looking for an unwired item - and item is already connection, keep looking...
            if (method === 'unwired' && this.connections['from'][to_item.id]) {
                continue;
            }

            //if looking for a wired item...
            if (method === 'wired') {
                //if already connected, keep looking...
                if (item.wires[to_item.id] || to_item.wires[item.id]) {
                    continue;
                }

                //if not wired - or hit max wires, keep looking...
                if (to_item.wire_count === 0 || to_item.wire_count >= to_item.max_wires) {
                    continue;
                }
            }

            //if ignore_connection (and not override_ignore)
            if (to_item.ignore_connection && !override_ignore) {
                continue;
            }

            //find the distance between the two items
            var from_item_distance = item.path.bounds.center.getDistance(to_item.path.bounds.center);

            //first item comparing - or distance is less than last compared - persist item
            if (!closest_item_point || from_item_distance < closest_item_point) {
                closest_item_point = from_item_distance;
                closest_item = to_item;

            } else if (preferred_direction && from_item_distance === closest_item_point) {
                //if we have two possible closest items (equal distance) check for a preferred direction (vertical or horizontal)
                if (preferred_direction == 'horizontal' && (item.path.bounds.center.y === to_item.path.bounds.center.y)) {
                    closest_item_point = from_item_distance;
                    closest_item = to_item;

                } else if (preferred_direction == 'vertical' && (item.path.bounds.center.x === to_item.path.bounds.center.x)) {
                    closest_item_point = from_item_distance;
                    closest_item = to_item;
                }
            }
        }

        return closest_item;
    },

    get_connection_through_point: function(first_item, second_item) {
        var first_point = first_item.path.bounds.center,
            second_point = second_item.path.bounds.center,
            midx = ((first_point.x + second_point.x) / 2),
            midy = ((first_point.y + second_point.y) / 2),
            //which wall is closest to midpoint?
            //mid_point = new Point(midx, midy),
            room_point = new Point(midx, midy);

        var diff = {
            x: Math.abs(first_item.path.bounds.center.x - second_item.path.bounds.center.x),
            y: Math.abs(first_item.path.bounds.center.y - second_item.path.bounds.center.y)
        };

        var arc_multiplier = 1.4,
            arc_amount_x = 0,
            arc_amount_y = 0;

        //make arcs get larger with lengths...
        /*var diff_check = (Math.abs(diff.x) + Math.abs(diff.y)) / 100;
         if(diff_check < 1) {
         arc_multiplier += (2 * diff_check);
         }*/

        if (diff.x < diff.y) {
            //if vertical...
            var room_x1 = first_item.room.path.bounds.x,
                room_x2 = (first_item.room.path.bounds.x + first_item.room.path.bounds.width),
                room_x1_diff = Math.abs(room_x1 - midx),
                room_x2_diff = Math.abs(room_x2 - midx);

            room_point.x = ((room_x1_diff < room_x2_diff) ? room_x1 : room_x2);
            arc_amount_x = (Math.round(Math.abs(first_point.y - second_point.y) * 0.1) * arc_multiplier);

        } else {
            //if horizontal...
            var room_y1 = first_item.room.path.bounds.y,
                room_y2 = (first_item.room.path.bounds.y + first_item.room.path.bounds.height),
                room_y1_diff = Math.abs(room_y1 - midy),
                room_y2_diff = Math.abs(room_y2 - midy);

            room_point.y = ((room_y1_diff < room_y2_diff) ? room_y1 : room_y2);
            arc_amount_y = (Math.round(Math.abs(first_point.x - second_point.x) * 0.1) * arc_multiplier);
        }

        //var debug_room_point = new Path.Circle(room_point, 5);
        //debug_room_point.strokeColor = 'blue';

        var xdiff = Math.round(midx - room_point.x),
            ydiff = Math.round(midy - room_point.y),
            xcurve = arc_amount_x,
            ycurve = arc_amount_y;

        if (xdiff > 0) {
            xcurve = (0 - arc_amount_x);
        }

        if (ydiff > 0) {
            ycurve = (0 - arc_amount_y);
        }

        var thru_point = new Point(midx + xcurve, midy + ycurve),
            arc_margin = 8;

        //get acceptable arc bounds...
        var rect_bounds = first_item.room.path.bounds;
        var inner_bounds = new paper.Rectangle({
            x: rect_bounds.x + (arc_margin / 2),
            y: rect_bounds.y + (arc_margin / 2),
            width: rect_bounds.width - arc_margin,
            height: rect_bounds.height - arc_margin
        });

        //test the point is outside the room bounds...
        if (!inner_bounds.contains(thru_point)) {
            //mirror arc (to keep within bounds)
            thru_point = new Point(midx - xcurve, midy - ycurve);
        }

        return thru_point;
    },

    get_closest_item_to_point: function(point, override_ignore) {
        var from_item,
            closest_item,
            distance,
            closest_item_point;

        for (var i in this.items) {
            from_item = this.items[i];
            distance = from_item.path.bounds.center.getDistance(point);

            //if connection is ignroed
            if (from_item.ignore_connection && !override_ignore) {
                continue;
            }

            //if max_wires connected
            if (from_item.wire_count >= from_item.max_wires) {
                continue;
            }

            if (!closest_item_point || distance < closest_item_point) {
                closest_item_point = distance;
                closest_item = from_item;
            }
        }

        return closest_item;
    },

    reset_connections: function() {
        this.connections = {
            'from': {},
            'to': {},
            'all': []
        };

        var item;
        for (var i in this.items) {
            item = this.items[i];
            item.wire_count = 0;
            item.wires = {};
        }
    },

    has_primary_switch: function() {
        return (this.primary_switch !== null && this.primary_switch !== undefined);
    },

    set_primary_switch: function(primary_switch) {
        this.primary_switch = primary_switch;
    },

    add_secondary_switch: function(secondary_switch) {
        this.secondary_switches[secondary_switch.id] = secondary_switch;
    },

    remove_item_switch: function(item_switch) {
        if (this.primary_switch === item_switch) {
            //clear primary switch? (this will be replaced)
            this.primary_switch = null;

        } else if (this.secondary_switches[item_switch.id]) {
            delete this.secondary_switches[item_switch.id];
        }
    },

    remove_secondary_switches: function() {
        var secondary_switch;

        for (var i in this.secondary_switches) {
            secondary_switch = this.secondary_switches[i];
            secondary_switch.remove_circuit(this);
            this.remove_item_switch(secondary_switch);
        }
    },

    swap_primary_switch: function(new_primary_switch) {
        //if not specified - find the next best (if possible)...
        if (!new_primary_switch) {
            var secondary_switch;

            //if secondary...
            for (var i in this.secondary_switches) {
                secondary_switch = this.secondary_switches[i];
                new_primary_switch = secondary_switch;
                delete this.secondary_switches[i];
                break;
            }

            //no secondary switch... look for another switch in the same room
            if (!new_primary_switch) {
                var room_switches = this.room.get_all_light_switches();

                if (room_switches.length > 1) {
                    for (var r in room_switches) {
                        if (room_switches[r] !== this.primary_switch) {
                            new_primary_switch = room_switches[r];
                            break;
                        }
                    }
                }
            }
        }

        if (new_primary_switch) {
            this.remove_item_switch(this.primary_switch);
            this.set_primary_switch(new_primary_switch);
            return true;
        }

        return false;
    },

    export: function() {
        var circuit = {
            id: this.id,
            room: this.room.id
        };

        circuit.items = [];
        for (var i in this.items) {
            circuit.items.push(this.items[i].id);
        }

        if (this.primary_switch) {
            circuit.primary_switch = this.primary_switch.id;
        }

        circuit.secondary_switches = [];
        for (var s in this.secondary_switches) {
            circuit.secondary_switches.push(this.secondary_switches[s].id);
        }

        return circuit;
    },

    remove: function() {
        //if no room
        if (!this.room) {
            delete app.designer.circuits[this.id];
            //delete this;
            return;
        }

        //if this is the rooms circuit, leave...
        if (this.room.circuit === this) {
            return;
        }

        var item = this.get_first_item();

        if (item) {
            item.room.refresh_circuits();
        }

        for (var i in this.items) {
            this.items[i].remove();
        }

        if (this.primary_switch) {
            this.primary_switch.remove_circuit(this);
        }

        for (var s in this.secondary_switches) {
            this.secondary_switches[s].remove_circuit(this);
        }

        delete this.room.all_circuits[this.id];
        delete app.designer.circuits[this.id];

        //delete this;
        app.ui.draw();
    }
});