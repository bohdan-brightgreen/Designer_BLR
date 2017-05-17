/**
 * app.ui.add_design
 * Opens the new design dialog
 *
 */
app.ui.add_design = {
	dialog: null,
	is_new_project: null,

	init: function() {

	},

	init_dialog: function(with_back) {
		app.project_manager.init();
		var buttons = { };

		buttons["Continue..."] = $.proxy(function() {
				var name = $('#add_design_name').val();
				if (name == '') {
					alert('The design name is required.');
					$('#add_design_name').focus();
					return;
				}
				var design = app.project_manager.create_new_design(name, '', this.is_new_project);
				//console.log(app.project_manager.project);
				app.ui.add_area.show(true, this.is_new_project);
		}, this);

		if (with_back) {
			buttons["Back"] = function() {
				app.ui.add_design.hide();
				app.ui.new_project.show();
				//app.show_get_started_dialog();
			};
		}

		if (!with_back) {
			buttons["Cancel"] = function() {
                $(this).dialog("close");
            };
		}
		var container = $('#add_design_dialog');
		this.dialog = container.dialog({
			title: 'New Design...',
			width: 500,
			/*height: 450,*/
			resizable: false,
			draggable: true,
			//position: this.get_dialog_position(),
			buttons: buttons,
			open: function() {
                app.ui.new_project.hide();
                app.ui.on_dialog_show();
                $(this).parent().find(".ui-dialog-titlebar-close").hide();
            },
			beforeClose: function() {
                app.ui.on_dialog_hide();
            }
		});
	},

	show: function(with_back, is_new_project) {
		is_new_project = (typeof is_new_project === 'undefined') ? false : is_new_project;
		this.is_new_project = is_new_project;
		if (!this.dialog) {
			this.init_dialog(with_back);

		} else {
			$(this.dialog).dialog("open");
		}

		//reset values...
		$('#add_design_name').val('');
	},

	hide: function() {
		if (this.dialog) {
			$(this.dialog).dialog("close");
		}
	}
};