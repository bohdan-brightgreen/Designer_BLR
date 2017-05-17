/**
 * Brightgreen Lighting Designer.
 *
 */
var app = {
	element: null,
	menubar: null,
	assets_accordion: null,
	designer: null,
	product_manager: null,
	status_bar: null,
	status_bar_content: null,
	drag_type: null,
	project_notes: null,
	json_version : 3.0,//this is in case we need to handle any changes to the format later on
	//note - update the storage key when we need to flush local storage
	storage_key: 'ld_prj_03',
	current_facscia_color: null,
	has_lights: false,
	has_furniture: false,
	_menubar_height: 0,
	_sidebar_width: 0,
	_status_bar_height: 0,
	show_leaving_confirm: null,

	//use_local_storage : false,//save to local storage or the server
	//api_url : 'https://designer.brightgreen.com/api/',
    api_url : 'https://designer.brightgreen.com/api/',
    api: null,

    colours: {
        main: '#00a950'
    },

	init: function() {
		this.show_leaving_confirm = true;
		if (document.domain == "designer.bg.dev") {
			this.show_leaving_confirm = false;
            this.api_url = 'https://designer.bg.dev/api/';
			console.log("Detected running on localhost and is switching to using local storage, start chrome with the -disable-web-security flag and use 127.0.0.2 to test server interaction");
		}

        this.api = {
            get: {
                projects: this.api_url + 'projects',
                project: this.api_url + 'project',
                designs: this.api_url + 'designs',
                design: this.api_url + 'design',
                areas: this.api_url + 'areas',
                area: this.api_url + 'area',
                share: this.api_url + 'share'
            },
            post: {
                project: this.api_url + 'project',
                design: this.api_url + 'design',
                area: this.api_url + 'area',
                share: this.api_url + 'share',
                export_image: this.api_url + 'export_image'
            },
            put: {
                project: this.api_url + 'project',
                design: this.api_url + 'design',
                area: this.api_url + 'area',
                share: this.api_url + 'share'
            },
            delete: {
                project: this.api_url + 'project',
                design: this.api_url + 'design',
                area: this.api_url + 'area',
                share: this.api_url + 'share'
            }
        };

		app.body = $(document.body);
		this.element = $("#lighting_designer");

		$('button').button();

		this.designer.init();
		this.product_manager.init();
		app.project_manager.init();

		$("#note_text").maxlength({max: 100});
		this.project_notes = "";

		app.ui.getting_started.show();

		app.ui.init();
	},

	pub: function(event, args) {
		//console.log(event, args);
		$(document).trigger(event, args);
	},

	sub: function(event, callback, scope) {
		$(document).on(event, $.proxy(callback, (scope || this)));
	},

	set_loading: function(element, loading) {
		if (loading) {
			element.append($('<div class="loading" />'));

		} else {
			element.find('.loading').remove();
		}
	},

	is_dragging: function() {
		return (app.dragging === true);
	},

	show_loading: function(message) {
		$('#loading-screen').slideDown();
		$('#loading-screen-text').html(message);
	},

	hide_loading: function() {
		$('#loading-screen').slideUp();
	},

	set_status: function(status) {
		//this.status_bar_content.text(status);
	},

	clear_status: function() {
		// var str = app.designer.get_hover_status();
		// this.status_bar_content.html(str);
		// app.designer.update_stats_box(app.designer.recommended_lumens, app.designer.reached_lumens);
	}
};

/**
 * Debugging helper
 */

app.debug = {

	export_as_sample: function() {
		var prj_string = JSON.stringify(app.project_manager.selected_project),
		    html = "app.sample_project = '" + prj_string+ "';",
		    x = $('<textarea/>').css({'width': 450, 'height': 420}).val(html),
		    y = $('<div/>').append(x);
		y.dialog({width: 500, height: 500});
	},

	import_project: function() {
		var x = $('<input type="file" value="Open Project JSON File..." />'),
		    y = $('<div/>').append(x);

		y.dialog({
			title: 'Import from JSON file',
			modal: true,
			buttons: {
				"Import": function() {
					//var project_data = x.val();
					var fileToLoad = x.get(0).files[0];
					var fileReader = new FileReader();

					fileReader.onload = function(fileLoadedEvent) {
						var project_json_text = fileLoadedEvent.target.result;
						var project = $.parseJSON(project_json_text);

						console.log("Imported", project);

						app.project_manager.projects = [project];
						app.project_manager.selected_project = project;
						app.project_manager.selected_design = app.project_manager.selected_project.designs[0];
						app.project_manager.selected_area = app.project_manager.selected_design.areas[0];

						app.pub('design_selected', [app.project_manager.selected_project, app.project_manager.selected_design]);

					};
					fileReader.readAsText(fileToLoad, "UTF-8");

					$(this).dialog( "close" );
				},
				Cancel: function() {
					$(this).dialog( "close" );
				}
			}
		});
	},

	outlines: function() {
		$.each(project.layers, function(i, layer) {
			$.each(layer.children, function(i, item) {
				item.style.strokeColor = 'red';
				item.style.strokeWidth = 1;
			});
		});

		view.draw();
	}
};

function goodbye(e) {
	if (app.show_leaving_confirm) {
		return 'You are about to leave Designer, you will lose any unsaved data if you continue.';
	}
}
window.onbeforeunload = goodbye;