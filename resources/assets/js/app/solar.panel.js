/**
 *	Class app.Solar
 *	Represents a solar panel
 *
 */
app.Asset.SolarPanel = app.Asset.extend({
    type: 'solar-panel',
    name: 'Solar panel (Tindo Solar)',
    width: 46,
    height: 83,
    rotation_step: 45,
    width_meters: 1,
    height_meters: 1.667,
    circuit: null,
    is_connecting: null,

    wire_count: null,
    max_wires: 3,
    wires: null,

    init: function(data) {
        _.extend(this, data);

        this.initializing = true;
        this._super(data);

        if (data.circuit) {
            app.designer.circuits[data.circuit].add_item(this);
        }

        this.is_connecting = false;
        this.initializing = false;
        this.wires = {};
    },

    move_finish: function() {
        this._super();

        this.circuit.show_connections(true);
    },

    on_mouse_enter: function(event) {
        if (app.is_dragging()) {
            return;
        }

        this._super(event);

        if (app.designer.is_disconnect_active()) {
            this.circuit.show_connections();
            this.disconnect_hover();

        } else if (app.designer.is_connect_active()) {
            this.circuit.show_connections();

            //if from light specified...
            if (app.designer.active_tool.from_light || app.designer.active_tool.from_switch) {
                app.designer.active_tool.to_light = this;
            }

            return;
        }
    },

    on_mouse_leave: function(event) {
        if (app.is_dragging()) {
            return;
        }

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
            //this.circuit.hide_connections(); // remove if uncomment above
        }
    },

    on_mouse_down: function(event) {
        if (event.event.button == 2) {
            this._super(event);
        }

        if (app.designer.is_disconnect_active()) {
            var previous_circuit = this.circuit;

            this.disconnect();

            previous_circuit.invoke_on_items('disconnect_unhover');
            this.circuit.invoke_on_items('disconnect_hover');

        } else if (app.designer.is_connect_active()) {
            //set light...
            app.designer.active_tool.from_light = this;
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

        room.refresh_circuits();

        old_circuit.redraw_connections();
        old_circuit.room.reconnect_light_switches();
        new_circuit.show_connections(true);
        new_circuit.room.reconnect_light_switches();
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

    set_active: function(active) {
        this._super(active);

        this.raster.opacity = 1;
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

        this._super();

        if (this.circuit) {
            this.circuit.show_connections(true);
            this.circuit.room.reconnect_light_switches();
        }
    },

    /*find_nearest_lights: function(tolerance, room, axis, allow_same_group) {
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
    },*/

    get_hover_status: function() {

    },

    delete_asset: function(event) {
        this._super();
        this.circuit.show_connections(true);
        this.circuit.room.reconnect_light_switches();
    },

    export: function() {
        var asset = this._super();

        asset.name = this.name;

        return asset;
    },

    get_layer: function() {
        return app.designer.layers.lights;
    }
});