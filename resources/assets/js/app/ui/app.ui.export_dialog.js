/**
 * app.ui.export_dialog
 * Opens the pdf export dialog
 *
 */
app.ui.export_dialog = {
	dialog: null,
	pdf_generate_counter: null,
	pdf_generate_timer: null,
	element: null,
	export_wiring_element: null,
	export_switches_element: null,
	export_furniture_element: null,
    export_format_element: null,
    export_datasheets_element: null,
	note_text_element: null,

	init: function() {
		this.element = $('#room_settings_dialog');
		this.bind_events();
		this.pdf_generate_counter = 0;
	},

	bind_events: function() {

	},

	init_dialog: function() {
		var buttons = {
            "Generate PDF": $.proxy(function() {
                //$(this).dialog("close");
                //app.save_additional_notes();
                app.project_manager.selected_design.description = this.note_text_element.val();
                this.download_pdf();
                this.hide();
            }, this),
            "Cancel": function() {
                $(this).dialog("close");
            }
        };

		this.element = $('#export_dialog');
		this.export_wiring_element = this.element.find('.export_wiring_chkbox');
		this.export_switches_element = this.element.find('.export_switches_chkbox');
		this.export_furniture_element = this.element.find('.export_furniture_chkbox');
        this.export_format_element = this.element.find('.export_format_chkbox');
        this.export_datasheets_element = this.element.find('.export_datasheets_chkbox');
		this.note_text_element = this.element.find('.pdf_note_text');
		this.dialog = this.element.dialog({
			title: 'Additional Notes',
			//width: 300,
			width: 500,
			height: 330,
			resizable: false,
			draggable: true,
			dialogClass: 'dialog_grey',
			buttons: buttons,
			open: function() {
                $(this).parent().find(".ui-dialog-titlebar-close").hide();
            }
		});

		this.refresh();
	},

	refresh: function() {
		var val = app.project_manager.selected_design.description;
			val = (val === 'null' || val === null || val === undefined) ? '' : val;
		this.note_text_element.val(val);
	},

	show: function() {
		if (!this.dialog) {
			this.init_dialog();
		}

		this.refresh();
		this.dialog.dialog("open");
	},

	hide: function() {
		if (this.dialog && this.dialog.is(':visible')) {
			$(this.dialog).dialog("close");
		}
	},

	download_pdf: function() {
		//make sure we have all the changes since the last save
		app.project_manager.selected_area['designer_data'] = app.designer.data_manager.export();

		app.project_manager.get_all_areas($.proxy(function(project_data) {
			var initially_selected_area = app.project_manager.selected_area;
			//console.log(json_data);
			app.ui.designer_overlay.show_loading("Generating PDF...");
			this.pdf_token_value = ("" + new Date().getTime());
			cookie_delete('pdf_token_cookie');

			for (var i in project_data.designs) {
				var design = project_data.designs[i];
				for (var j in design.areas) {
					var area_data = design.areas[j].designer_data;
                    area_data.has_background = (area_data.background !== null);
				}
			}

			this.load_all_area_images(app.project_manager.selected_design, 0, $.proxy(function() {
				app.ui.designer_overlay.show_loading('Uploading Data...');
				app.project_manager.select_area(initially_selected_area);

				$('#pdf_token_cookie').val(this.pdf_token_value);
				//clone the object so we can remove bg images etc
				var clone = JSON.parse(JSON.stringify(project_data));
				clone['include_furniture'] = this.export_furniture_element.is(':checked');
                clone['pdf_format'] = this.export_format_element.is(':checked') ? 'A3' : 'A4';
                clone['datasheets'] = this.export_datasheets_element.is(':checked');

				for (var i in clone.designs) {
					var design = clone.designs[i];
					for (var j in design.areas) {

                        //clone.designs[i].areas[j].value = null;
                        var area_data = design.areas[j];
                        //remove background to reduce size
                        area_data.designer_data.background = null;
                        area_data.value = null;

                        //Save image to server
                        area_data.export_image_id = app.project_manager.export_image(area_data.image);
                        area_data.image = null;

						/*var area_data = design.areas[j].designer_data;
						//remove background to reduce size
						area_data.background = null;*/
					}
				}

				var json_data = JSON.stringify(clone);
				$('#pdf_data').val(json_data);
				$('#pdf_form').submit();

				this.pdf_generate_counter = 0;
				this.pdf_generate_timer = window.setInterval($.proxy(this.check_pdf_generated, this), 500);
			}, this));

		}, this));
	},

	//we need to this because it takes the canvas a while to load all images
	load_all_area_images: function(design, count, callback) {
		if (count == design.areas.length) {
			callback();
			return;
		}
		app.ui.designer_overlay.show_progress("Generating Images...", design.areas.length, count + 1);

		app.project_manager.select_area(design.areas[count]);
		window.setTimeout($.proxy(function() {
			app.designer.populate_notes();
			design.areas[count]['notes'] = app.designer.notes;
			var img_data = false;
			if (design.areas[count].designer_data.rooms.length > 0) {
				img_data = app.designer.data_manager.get_image(design.areas[count], this.export_wiring_element.is(':checked'), this.export_switches_element.is(':checked'));
			}

			/*if(img_data === false) {
				alert(design.areas[count].title + " does not contain any rooms.  Please add rooms before exporting as a PDF.");
				app.ui.designer_overlay.hide_loading();
			}
			else {*/
				design.areas[count]['image'] = img_data;
				count = count + 1;
				this.load_all_area_images(design, count, callback);
			//}

		}, this),  1000);
	},

	check_pdf_generated: function() {
		var token = cookie_get('pdf_token_cookie');
		if (token >= this.pdf_token_value || this.pdf_generate_counter === 100) {
			app.ui.designer_overlay.hide_loading();
			window.clearInterval(this.pdf_generate_timer);
			return;
		}

		var messages = {
			2: "Drawing Rooms",
			7: "Calculating Distances",
			12: "Creating Summaries",
			17: "Preparing Download"
		};

		if (messages[this.pdf_generate_counter]){
			app.ui.designer_overlay.show_loading(messages[this.pdf_generate_counter]);
		}

		this.pdf_generate_counter++;
	}
};