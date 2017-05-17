/**
 * app.ui.create_panel_lights
 * Panel to add lights to designer
 *
 */
app.ui.create_panel_lights = {

	element: null,
	selected_series: null,
	selected_product_type: null,
	selected_product: null,
	selected_designer_light: null,
	product_code_field: null,

	init: function() {
		this.element = $('#add_lights_panel');
		this.bind_events();

		this.element.find('ul.selectable li').draggable({
			opacity: 0.7,
			scroll: false,
			appendTo: 'body',
			helper: "clone",
			cursorAt: {
                'left': -5
            },
			start: function(event, ui) {
				app.drag_type = ($(event.target).data('type-selected') || $(event.target).data('type'));
				app.dragging = true;
				app.designer.dragging_new_asset = true;
			},
			stop: function(event, ui) {
				app.designer.reset_cursor();

				//if didn't drop on canvas...
				if (event.srcElement != app.designer.element[0]) {
					app.designer.cancel_drop();
				}
			}
		});
	},

	bind_events: function() {
		app.sub('designer_light_selected', this.on_designer_light_selected, this);
		app.sub('designer_light_unselected', this.on_designer_light_unselected, this);
		app.sub('designer_group_selected_after_resize', this.on_designer_group_selected_after_resize, this);

		$(document.body).on('click','.series_btn', $.proxy(this.on_series_click, this));
		$(document.body).on('mousedown', '.product_type_btn', $.proxy(this.on_product_type_mousedown, this));
		$(document.body).on("change", ".light_option_field", $.proxy(this.on_product_field_change, this));
		$(document.body).on("keyup", ".custom_light_option_field", $.proxy(this.on_product_custom_field_change, this));
		$(document.body).on("click", "#generate_button", $.proxy(this.on_generate_click, this));

		Handlebars.registerHelper('tolower', function(options) {
            return options.fn(this).toLowerCase();
        });
	},

	show: function() {
		if (!this.rendered_products) {
			//load products...
			app.product_manager.get_products('', $.proxy(this.on_get_products_callback, this));
		}

		this.element.show();
	},

	on_get_products_callback: function(data, status) {
		this.rendered_products = true;
		this.render_series_list(data);
		$('#series_btn_list li:first a').click();
	},

	render_series_list: function(series) {
		app.ui.render_template("series_list_template", series, "#series_list");
	},

	on_series_click: function(e) {
		var clicked_item = $(e.target);
		var name = clicked_item.data("name");

		this.selected_series = name;
		this.show_series_by_name(name);
	},

	show_series_by_name: function(name) {
		var lights = _.find(app.product_manager.data, {
            name: name
        }).data;
		this.render_product_list(lights);

		//show first light..
        //console.log('app.ui.create_panel_lights.show_series_by_name');
		$('#product_list li:first').click();
		this.on_select_product_type(lights[0], true);
	},

	render_product_list: function(products) {
		app.ui.render_template("product_list_template", products, "#product_list");

		//draggable...
		$('#product_list .drag_asset').draggable({
			opacity: 0.7,
			scroll: false,
			appendTo: 'body',
			helper: "clone",
			cursorAt: {
                'left': -5
            },
			start: $.proxy(this.start_drag, this),
			stop: $.proxy(this.stop_drag, this)
		});
	},

	on_product_type_mousedown: function(e) {
		var light_element = (e.target.tagName === 'LI') ? $(e.target) : $(e.target).closest('LI'),
		    id = light_element.data("id"),
            light = (id !== 'CUSTOM') ? app.product_manager.get_light_type_by_id(id) : this.get_custom_light_type();

		this.on_select_product_type(light);

		if (this.selected_designer_light) {
			window.setTimeout($.proxy(this.check_light_change, this), 200);
		}
	},

	get_custom_light_type: function() {
		return {
			is_custom: true,
			code: 'custom',
			series_name: this.selected_series.toLowerCase()
		};
	},

	check_light_change: function() {
		if (this.selected_designer_light && this.selected_designer_light.code !== this.selected_product.code) {
			this.change_selected_designer_light();
		}
	},

	on_select_product_type: function(product_type, ignore_change) {
		if (!this.selected_product_type 
			|| this.selected_product_type.code !== product_type.code
			|| this.selected_product_type.series !== product_type.series
		) {
			this.selected_product_type = product_type;
			this.render_light_options(product_type);

			this.update_selected_product();
		}
	},

	render_light_options: function(light) {
		if (!light.is_custom) {
			app.ui.render_template("light_options_template", light, "#light_options");

			//hide options with just one value (and select them)
			$('.light_option').each(function(element, idx) {
				var light_option = $(this),
				    select = light_option.find('select'),
				    options = select.find('option');

				if (options.length === 0) {
					//hide field if no options
					light_option.hide();

				} else if (options.length === 1) {
					//hide select if just one, and set value of single_value div
					select.hide();
					light_option.find('.single_value').html(options.get(0).text);

				} else {
					light_option.show();
				}
			});

		} else {
			//custom light...
			app.ui.render_template("custom_light_options_template", {}, "#light_options");
		}

		this.product_code_field = $('#product_code_field');
	},

	on_product_field_change: function() {
		this.update_selected_product();
		this.check_light_change();
	},

	on_product_custom_field_change: function() {
		if (this.selected_designer_light && this.selected_designer_light.is_custom) {
			var custom_light_data = this.get_custom_light_data();
			this.selected_designer_light.set_custom_light_data(custom_light_data.code, custom_light_data.color_temperature, custom_light_data.lumens, custom_light_data.wattage);

			app.pub('custom_light_field_change');
		}

		this.update_selected_product();
	},

	get_selected_product: function() {
		if (this.selected_product_type.is_custom !== true) {
			var selected_product_code = this.get_selected_code();
			return app.product_manager.get_product_by_code(selected_product_code);
		}

        return this.get_custom_light();
	},

	get_selected_code: function() {
		var colour_temp = $("#colour_temp").val(),
		    beam_angle = $("#beam_angle").val(),
		    fascia_colour = $("#fascia_colour").val(),
		    light_type = $("#light_type").val(),
		    code = this.selected_product_type.code;

		if (light_type) {
			code += "." + light_type;
		}

		code += "-" + this.selected_product_type.series_code + "-" + colour_temp + "-" + beam_angle + "-" + fascia_colour;
		return code;
	},

	get_custom_light_data: function() {
		var container = $('#light_options'),
		    code = container.find('.custom_name').val(),
		    color_temperature = parseFloat(container.find('.custom_color_temp').val(), 10),
		    lumens = parseFloat(container.find('.custom_lumens').val(), 10),
		    wattage = parseFloat(container.find('.custom_wattage').val(), 10);

		return {
			code: code,
			color_temperature: (color_temperature || 0),
			lumens: (lumens || 0),
			wattage: (wattage || 0)
		};
	},

	get_custom_light: function() {
		var custom_light_data = this.get_custom_light_data();

		return {
			is_custom: true,
			type: 'custom',
			code: custom_light_data.code,
			lumens: custom_light_data.lumens,
			wattage: custom_light_data.wattage,
			color_temperature: custom_light_data.color_temperature
		};
	},

	update_selected_product: function() {
		this.selected_product = this.get_selected_product();
		this.render_product_code();
	},

	render_product_code: function() {
		this.product_code_field.html(this.selected_product.code);
	},

	change_selected_designer_light: function() {
		var light_data = $.extend({}, this.selected_product);

		if (!light_data.type) {
			light_data.type = light_data.code.toLowerCase();
		}

		if (this.selected_designer_light.group) {
			this.selected_designer_light.group.change_type(light_data);

		} else {
			this.selected_designer_light = this.selected_designer_light.change_type(light_data);
		}

		app.ui.draw();
	},

	start_drag: function(event, ui) {
		var light_data = $.extend({}, this.selected_product);

		if (!light_data.type) {
			light_data.type = light_data.code.toLowerCase();
		}

		light_data.x = -10000;
		light_data.y = -10000;

		var light = new app.Light(light_data);

		app.designer.drag_asset = light;
		app.designer.drag_offset.x = (light.width / 2) + 6;
		app.designer.drag_offset.y = 0 - (light.height / 2);

		app.drag_type = light_data.code.toLowerCase();
		app.dragging = true;
		app.designer.dragging_new_asset = true;
	},

	stop_drag: function(event, ui) {
		app.designer.reset_cursor();

		//if didn't drop on canvas...
		if (event.srcElement != app.designer.element[0]) {
			app.designer.cancel_drop();
		}
	},

	show_selected_designer_light: function() {
		//based on the light provided - select in ui...
		if (this.element && this.element.is(':visible')) {

			if (this.selected_designer_light.is_custom !== true) {
				var light = app.product_manager.get_product_by_code(this.selected_designer_light.code);
				this.select_light(light);

			} else {
				this.select_custom_light(this.selected_designer_light);
			}

			this.update_selected_product();

		}
	},

	select_light: function(light) {
		var series_btn = $('.series_btn [data-name="' + light.series.value + '"]');
		series_btn.click();

		var product_btn = $('.drag_asset[data-code="' + light.model.code + '"] a');
		product_btn.click();

		this.on_product_type_mousedown({
            target: product_btn.parent().get(0)
        });

		$("#beam_angle").val(light.beam_angle.code);
		$("#colour_temp").val(light.color_temperature.code);
		$("#fascia_colour").val(light.fascia_color.code);

		if (light.light_type) {
			$("#light_type").val(light.light_type.code);
		}
	},

	select_custom_light: function(light) {
		var visible_custom_btn = $('.custom_product_type_btn:visible');
		visible_custom_btn.click();
		this.on_product_type_mousedown({
            target: visible_custom_btn.parent().get(0)
        });

		var container = $('#light_options');
		container.find('.custom_name').val(light.code);
		container.find('.custom_color_temp').val(light.color_temperature);
		container.find('.custom_lumens').val(light.lumens);
		container.find('.custom_wattage').val(light.wattage);
	},

	on_designer_light_selected: function(e, light) {
		this.selected_designer_light = light;

		if (app.ui.is_paused()) {
			return;
		}

		if (this.element && this.element.is(':visible')) {
			this.show_selected_designer_light();
		}
	},

	on_designer_light_unselected: function() {
		this.selected_designer_light = null;

		/*if (app.ui.is_paused()) {
			return;
		}*/

		/*if (this.element && this.element.is(':visible')) {
            //console.log('app.ui.create_panel_lights.on_designer_light_unselected: ' + $('.series_btn:first a').data('name') );
			this.show_series_by_name($('.series_btn:first a').data('name'));
		}*/
	},

	on_designer_group_selected_after_resize: function(e, light) {
		this.selected_designer_light = light;

		if (this.element && this.element.is(':visible')) {
			this.show_selected_designer_light();
		}
	},

	on_generate_click: function() {
		if (app.designer.selected && app.designer.selected instanceof app.Room) {
			var room = app.designer.selected;

			if (room.get_lights_count() > 0) {
				if (!confirm('This will replace all the lights in the selected room with our best estimate - are you sure this is ok?')) {
					return;
				}
			}

			room.calculate_best_guess();

		} else {
			alert('Please select a room before using the Estimator. Simply click on a room to select it.');
		}
	}
};