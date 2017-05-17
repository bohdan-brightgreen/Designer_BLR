/**
 * app.ui.getting_started
 * Opens the add "Getting Started" dialog
 *
 */
app.ui.getting_started = {
	dialog: null,
	initialised : null,
	init: function() {
		this.initialised = true;

		this.bind_events();
	},

	bind_events: function() {
		app.sub('not_logged_in', this.on_not_logged_in, this);
		app.sub('design_selected', this.on_design_selected, this);
	},

	init_dialog: function(with_back) {
		if (!this.initialised) {
			this.init();
		}

		var container = $('#getting_started_dialog');
		this.dialog = container.dialog({
			title: 'Project Options',
			width: 665,
			resizable: false,
			draggable: true,
			dialogClass: 'dialog_large',
			open: function() {
                app.ui.add_design.hide();
                app.ui.on_dialog_show();
                $(this).parent().find(".ui-dialog-titlebar-close").hide();
            },
			beforeClose: function() {
                app.ui.on_dialog_hide();
            }
		});

		//$(document.body).on('click','.design_item', $.proxy(this.on_design_click, this));
	},

	on_design_selected: function() {
		this.hide();
	},

	show: function(with_back) {
		is_new_project = (typeof is_new_project === 'undefined') ? false : is_new_project;
		this.is_new_project = (typeof is_new_project === 'undefined') ? false : is_new_project;

		this.init_dialog(with_back);

	},

	hide: function() {
		if (this.dialog) {
			$(this.dialog).dialog("close");
		}
	},

	on_not_logged_in: function(e, data) {
		this.hide();
	}
};