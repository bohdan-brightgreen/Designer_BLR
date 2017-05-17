/**
 * app.ui.new_project
 * Opens the new project dialog
 *
 */
app.ui.new_project = {
	dialog: null,
	is_new_project: null,
	floorplan_uploader: null,
	init: function() {
		this.bind_events();
	},

	bind_events: function() {
		app.sub('floorplan_upload_complete', this.on_floorplan_upload_complete, this);
	},

	init_dialog: function(with_back) {
		if (!this.dialog) {
			//first time - initialize...
			this.init();
		}

		this.floorplan_uploader = new app.ui.FloorplanUpload('#new_project_floorplan', true);
		app.project_manager.init();
		var buttons = { };

		buttons["Continue..."] = $.proxy(function() {
			var project_name = $('#new_project_name').val(),
			    project_type = $('#new_project_type').val(),
			    client_name = $('#new_project_client').val(),
			    client_email = $('#new_project_client_email').val();

			if (project_name === '') {
				alert('The project name is required.');
				$('#new_project_name').focus();
				return;
			}

			if (project_type === 'Choose...') {
				alert('The project type is required.');
				$('#new_project_type').focus();
				return;
			}

			/*if(client_name === '') {
				alert('The client name is required.');
				$('#new_project_client').focus();
				return;
			}
			if(client_email === '') {
				alert('The client email is required.');
				$('#new_project_client_email').focus();
				return;
			}*/
			var user_name = (typeof user === 'object') ? user.name : 'Retailer';

			if (this.floorplan_uploader.is_floorplan_selected()) {
				app.project_manager.create_new_project(project_name, project_type, client_name, client_email);
				app.project_manager.create_new_design(user_name, '', true);
				app.project_manager.create_new_area('Area 1', '', true);
				this.floorplan_uploader.upload_pdf(project_name, project_type, 'Area 1');

			} else {
				app.project_manager.create_new_project(project_name, project_type, client_name, client_email);
				app.project_manager.create_new_design(user_name, '', true);
				app.project_manager.create_new_area('Area 1', '', true);
				app.project_manager.select_new_project();
				app.designer.initialize_new_area();
				this.hide();
			}
		}, this);

		//app.ui.floorplan_upload.init('#new_project_floorplan');

		if (with_back) {
			buttons["Back"] = $.proxy(function() {
				this.hide();
				if (!app.project_manager.selected_project) {
					app.ui.getting_started.show();
				}
			}, this);
		}

		if (!with_back) {
			buttons["Cancel"] = $.proxy(function() {
				this.hide();
				if (!app.project_manager.selected_project) {
					app.ui.getting_started.show();
				}
			}, this);
		}
		var container = $('#new_project_dialog');
		this.dialog = container.dialog({
			title: 'Start From Scratch',
			width: 665,
			resizable: false,
			draggable: true,
			dialogClass: 'dialog_large',
			buttons: buttons,
			open: function() {
                app.ui.getting_started.hide();
                app.ui.on_dialog_show();
                $(this).parent().find(".ui-dialog-titlebar-close").hide();
            },
			beforeClose: function() {
                app.ui.on_dialog_hide();
            }
		});
		//$(document.body).on('click','.design_item', $.proxy(this.on_design_click, this));
	},

	show: function(with_back, is_new_project) {
		is_new_project = (typeof is_new_project === 'undefined') ? false : is_new_project;
		this.is_new_project = is_new_project;
		//if(!this.dialog) {
			this.init_dialog(with_back);
		//}

		//app._get_started_dialog.dialog("close");

		//reset values...
		if (!app.project_manager.new_project) {
			$('#new_project_name').val('');
			$('#new_project_type').val('');
			$('#floorplan_file').val('');
			$('#floorplan_pdf_page').val('1');
		}
	},

	hide: function() {
		if (this.dialog) {
			this.dialog.dialog("close");
		}
	},

	/*on_project_save_callback: function(project) {
		console.log("saved", project);
		app.ui.show_tooltip('Project saved locally', 3000);
		app.ui.add_design.show();
	},*/

	on_floorplan_upload_complete: function (e, data) {
		console.log(data);
		this.hide();
	}
};