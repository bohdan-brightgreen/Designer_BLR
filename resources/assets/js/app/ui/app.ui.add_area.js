/**
 * app.ui.add_area
 * Opens the add area dialog
 *
 */
app.ui.add_area = {
	dialog: null,
	//is_new_project: null,
	uploaded_floorplan_data: null,
	floorplan_uploader: null,
	//valid_floorplan_types: ['pdf', 'gif', 'tiff', 'png', 'jpg', 'jpeg'],
	init: function() {
		this.bind_events();
	},

	bind_events: function() {
		app.sub('floorplan_upload_complete', this.on_floorplan_upload_complete, this);
	},

	init_dialog: function(with_back) {
		//app.project_manager.init();
		if (!this.dialog) {
			//first time - initialize...
			this.init();
		}

		var buttons = { };

		buttons["Continue..."] = $.proxy(function() {

			var name = $('#add_area_name').val();
			if (name === '') {
				alert('The area name is required.');
				$('#add_area_name').focus();
				return;
			}

			if (this.floorplan_uploader.is_floorplan_selected()) {
				var area2 = app.project_manager.create_new_area(name, '');
				this.floorplan_uploader.upload_pdf(app.project_manager.selected_project.title, app.project_manager.selected_project.type, name);

			} else {
				var area = app.project_manager.create_new_area(name, '');
				app.project_manager.select_area(area);
				app.designer.initialize_new_area();
				this.hide();
			}
		}, this);

		if (with_back) {
			buttons["Back"] = function() {
				app.ui.add_design.dialog.show();
				app.ui.add_area.dialog.hide();
			};
		}

		if (!with_back) {
			buttons["Cancel"] = function() {
                $(this).dialog("close");
            };
		}

		var container = $('#add_area_dialog');
		this.dialog = container.dialog({
			title: 'New Area...',
			width: 500,
			/*height: 450,*/
			resizable: false,
			draggable: true,
			//position: this.get_dialog_position(),
			buttons: buttons,
			open: function() {
                app.ui.add_design.hide();
                app.ui.on_dialog_show();
                $(this).parent().find(".ui-dialog-titlebar-close").hide();
            },
			beforeClose: function() {
                app.ui.on_dialog_hide();
            }
		});
	},

	show: function(with_back) {
		this.init_dialog(with_back);

		this.floorplan_uploader = new app.ui.FloorplanUpload('#new_area_floorplan');

		//reset values...
		$('#add_area_name').val('Area ' + parseInt(app.project_manager.selected_design.areas.length + 1));
	},

	hide: function() {
		if (this.dialog) {
			$(this.dialog).dialog("close");
		}
	},

	/*on_project_save_callback: function(project) {
		console.log("saved", project);
	},*/

	on_floorplan_upload_complete: function(e, data) {
		this.hide();
	}
};