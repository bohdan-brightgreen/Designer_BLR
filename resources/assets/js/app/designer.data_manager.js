app.designer.data_manager = {

	export: function(with_image, include_wiring, include_switches) {
		include_wiring = (typeof include_wiring === "undefined") ? true : include_wiring;
		include_switches = (typeof include_switches === "undefined") ? true : include_switches;

		var img_data;
		if (with_image) {
			var previously_selected = app.designer.selected;
			if (app.designer.selected !== null) {
				app.designer.clear_selected();
			}

			//check image..
			img_data = app.designer.get_image(10, include_wiring, include_switches);

			if (img_data === false) {
				app.show_tooltip('Error, empty project. Add rooms, furniture and lights before exporting image');
				return false;
			}

            if (previously_selected !== null) {
				previously_selected.set_selected(true);
			}
		}

		var total_wire_length = app.designer.get_total_wire_length();//we need to use to add a 10% adjustment to this here
		var total_wire_length_adjusted = total_wire_length + (total_wire_length / 100) * 10;

		var prj = {
			//name: this.project_name,
			//property_type: this.property_type,
			//client_name: this.client_name,
			//client_email: this.client_email,
			background: app.designer.export_background_img(),
			recommended_lumens: app.designer.recommended_lumens,
			recommended_lux: app.designer.recommended_lux,
			recommended_workplane_lux: app.designer.recommended_workplane_lux,
			recommended_wattage_sqm: app.designer.recommended_wattage_sqm,
			reached_lumens: app.designer.reached_lumens,
			reached_lux: app.designer.reached_lux,
			reached_workplane_lux: app.designer.reached_workplane_lux,
			reached_wattage: app.designer.reached_wattage,
			reached_wattage_sqm: app.designer.reached_wattage_sqm,
			circuits: app.designer.export_circuits(),
			light_groups: app.designer.export_light_groups(),
			rooms: app.designer.export_rooms(),
			room_scale: app.designer.room_scale,
			wire_length: total_wire_length,
			wire_length_adjusted: total_wire_length_adjusted,
			square_metres: app.designer.square_meters,
			json_version : app.json_version,
			project_notes : app.project_notes
		};

		if (with_image) {
			prj.image = img_data;
			app.designer.populate_notes();
			prj.notes = app.designer.notes;
		}
		//console.log(prj);
		return prj;
	},

	get_image: function(area, include_wiring, include_switches) {
		include_wiring = (typeof include_wiring === "undefined") ? true : include_wiring;
		include_switches = (typeof include_switches === "undefined") ? true : include_switches;

		var img_data = app.designer.get_image(10, include_wiring, include_switches);
		//console.log(img_data);
		if (img_data === false) {
            app.ui.show_tooltip('Error, empty project. Add rooms, furniture and lights before exporting image');
			return false;
		}

		return img_data;
	}
};