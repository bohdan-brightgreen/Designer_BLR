/**
 * app.ui.open_project
 * Opens open project dialog
 *
 */
app.ui.open_project = {
	dialog: null,
	events_initialised: null,
	not_logged_in: null,

	init: function() {

	},

	init_dialog: function() {
		this.not_logged_in = false;
		var container = $('#open_project_dialog');
		this.dialog = container.dialog({
			title: 'Load Project',
			width: 500,
			//height: "auto",
			height: 450,
			//maxHeight: 400,
			modal: false,
			dialogClass: 'dialog_large',
			resizable: false,
			draggable: true,
			buttons: [],
			open: function() {
				app.ui.getting_started.hide();
				app.ui.on_dialog_show();
				//var max_height = ($(window).height() - $(this).offset().top - 20);
				//$(this).css("maxHeight", max_height);
				//$(this).parent().find(".ui-dialog-titlebar-close").hide();
			},
			beforeClose: $.proxy(function() {
				app.ui.on_dialog_hide();
				if (!app.project_manager.selected_project && !this.not_logged_in) {
					app.ui.getting_started.show();
				}
			}, this)
		});

		if (!this.events_initialised) {
            $(document.body).on('click','.project_name', $.proxy(this.on_project_click, this));
			//$(document.body).on('click','.design_item', $.proxy(this.on_design_click, this));
			$(document.body).on('click','.delete_design', $.proxy(this.on_delete_click, this));
			$(document.body).on('click','.delete_project', $.proxy(this.on_delete_project_click, this));
			app.sub('not_logged_in', this.on_not_logged_in, this);
            app.sub('project_manager.project.ready', this.on_project_ready, this)
			this.events_initialised = true;
		}
	},

	show: function() {
		//if(!this.dialog) {
			this.init_dialog();
		//}
		$('#project_list').hide();
		$('#project_list_loading').show();
		app.project_manager.get_projects($.proxy(this.on_get_projects_callback, this));
		this.dialog.dialog("open");
	},

	hide: function() {
		if (this.dialog) {
			this.dialog.dialog("close");
		}
	},

	on_get_projects_callback: function(data) {
		app.ui.render_template("project_list_template", data, "#project_list");
		$('#project_list').show();
		$('#project_list_loading').hide();
		$('#no_projects_message button').button();
	},

    on_project_click: function(e) {
        var projectId = $(e.target).data('project-id');

        app.project_manager.select_project(projectId);

        $('#project_list').hide();
        $('#project_list_loading').show();
    },

    on_project_ready: function() {
        this.hide();
    },

	/*on_design_click: function(e) {
		var clicked_item =  (e.target.tagName === 'LI') ? $(e.target) : $(event.target).closest('LI'),
		    project_id = clicked_item.data("project-id"),
            //design_id = clicked_item.data("design-id"),
		    design_index = clicked_item.data("design-index");

		//app.project_manager.select_design(project_id, design_id);
		app.project_manager.select_design(project_id, design_index);
		this.hide();
	},*/

	on_delete_click: function(e) {
		/*var clicked_item =  (e.target.tagName === 'SPAN') ? $(e.target) : $(event.target).closest('SPAN');
		e.stopPropagation();
		var design_id = $(clicked_item).data('design-id');
		if (confirm('Are you sure you want to delete this design?')) {

		}*/
	},

	on_not_logged_in: function(e, data) {
		this.not_logged_in = true;
		this.hide();
	},

	on_delete_project_click: function(e) {
		var clicked_item =  (e.target.tagName === 'A') ? $(e.target) : $(e.target).closest('A');
		if (confirm('Are you sure you want to delete this project')) {
			var project_id = clicked_item.data("project-id");
			app.project_manager.delete_project(project_id, function(data) {
				$('#project_info_' + project_id).slideUp();
			});
		}
	}
};
