/**
 * app.ui
 *
 */
app.ui = {
	tooltip: null,
	tooltip_shown: [],
	display_tooltips: null,
	compiled_templates:  null,
	_pause_render: null,

	init: function() {
		this.pause_render = false;
		this.compiled_templates = [];

		app.ui.menu_bar.init();
		app.ui.create_panel.init();
		app.ui.details_panel.init();
		app.ui.room_controls.init();
		app.ui.light_controls.init();
		app.ui.asset_controls.init();
		//app.ui.log_in.init();
		app.ui.designer_overlay.init();
		app.ui.image_crop.init();
		app.ui.message.init();

		this.init_collapsibles();
		this.init_togglables();
		this.init_helper_tooltip();
		this.init_tooltips();

		this.init_no_backspace();
		this.init_light_icon_images();
	},

	init_no_backspace: function() {
		//important! stop delete key from going back unless on input
		$(document).on("keydown", function (e) {
			if (e.which === 8 && !$(e.target).is("input, textarea")) {
				e.preventDefault();
			}
		});
	},

	init_light_icon_images: function() {
        app.product_manager.get_products('', $.proxy(function(data){}, this));
	},

    validate_email: function(str) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(str);
    },

	/**
	 * Collapsible panels
	 */
	init_collapsibles: function() {
		$('.collapsible .collapsible_header').click(function(){
			app.ui.toggle_collapsible($(this).parent());
		});
	},

	/*show_collapsible: function(element) {
		app.ui.toggle_collapsible(element, true);
	},*/

	toggle_collapsible: function(element, force) {
		//element = $(element);
		//var content = element.find('.collapsible_content');

        $(element).find('.collapsible_content')[force ? 'slideDown': 'slideToggle'](100, function() {
			var is_visible = $(this).is(':visible'),
			    action = (is_visible ? 'addClass' : 'removeClass'),
			    parent = $(this).parent();

			parent[action]('expanded');

			// collapse any expanded...
			// if(is_visible) {
			//	app.ui.toggle_collapsible(parent.parent().find('.collapsible').not(element));
			// }
		});
	},

	/**
	 * Togglable button groups
	 */
	init_togglables: function() {
		$(document.body).on('click','.togglable:not(.manual)', function(){
			var _this = $(this);
			//if allowed to toggle off...
			if (_this.hasClass('offable') && _this.hasClass('active')) {
				_this.removeClass('active');

			} else {
				_this.parent().find('.togglable.active').removeClass('active');
				_this.addClass('active');
			}
		});
	},

	render_template: function(template_id, data, output_selector) {
		var template_compiled_name = ("_tmpl_comp" + template_id),
		    compiled_template;

		if (!this.compiled_templates[template_compiled_name]) {
			var template_str = $('#' + template_id).html();
			compiled_template = Handlebars.compile(template_str);

		} else {
			compiled_template = this.compiled_templates[template_compiled_name];
		}

		var html = compiled_template(data);
		$(output_selector).html(html);
	},

	on_dialog_hide: function() {
		$('body').removeClass('dialog_show');
		app.dialog_showing = false;
	},

	on_dialog_show: function() {
		$('body').addClass('dialog_show');
		app.dialog_showing = true;
	},

	draw: function() {
		if (!app.designer.is_loading && !this._pause_render) {
			paper.view.draw();
		}
	},

	is_paused: function() {
		return this._pause_render;
	},

	pause_rendering: function() {
		this._pause_render = true;
	},

	resume_rendering: function() {
		this._pause_render = false;
	},

	/**
	 * Tooltips
	 */
	show_tooltip: function(text, time, just_once) {
		if (!this.display_tooltips || just_once && this.tooltip_shown[text] !== undefined) {
			return;
		}

		$('#tooltip_text').html(text);
		this.tooltip.slideDown('fast');

		var timeout = (time || 3000);

		if (app._tooltip_timeout) {
			window.clearTimeout(app.ui._tooltip_timeout);
		}

		//if just showing once per session...
		if (just_once) {
			this.tooltip_shown[text] = true;
		}

		app.ui._tooltip_timeout = window.setTimeout($.proxy(function() {
			this.hide_tooltip();
		}, this), timeout);
	},

	hide_tooltip: function() {
		this.tooltip.slideUp('fast');
	},

	disable_tooltips: function() {
		//disable for 30 days...
		window.cookie_set('disable_tooltips', true, 30);
		this.display_tooltips = false;
		this.hide_tooltip();
		//this.refresh_tooltip_menu_item();
	},

	enable_tooltips: function() {
		window.cookie_delete('disable_tooltips');
		this.display_tooltips = true;
		//this.refresh_tooltip_menu_item();
	},

	refresh_tooltip_menu_item: function() {
        var msg = this.display_tooltips ? 'Hide' : 'Show';

        $('#toggle_tooltips span').html(msg + ' Tooltips');
	},

	toggle_tooltips: function() {
		if (!this.display_tooltips) {
			this.enable_tooltips();

		} else {
			this.disable_tooltips();
		}
	},

	is_tooltips_enabled: function() {
		return !(window.cookie_get('disable_tooltips') === "true");
	},

	init_helper_tooltip: function() {
		this.tooltip = $('#tooltip');
		this.tooltip.css('left', (app.designer.element.position().left + (app.designer.element.width() / 2) - (this.tooltip.width() / 2)));
		this.display_tooltips = this.is_tooltips_enabled();
		this.refresh_tooltip_menu_item();
	},

	init_tooltips: function() {
		//dynamically apply furniture tooltip data...
		$('#furniture_container li').each(function(i, li){
			li = $(li);
			var text = li.find('.txt').html();
			li.attr('rel', 'tooltip');
			li.attr('title', ('Drag & drop ' + text));
		});

		//hide furniture tooltips on container scroll
		$('#furniture_container').on('scroll', function(){
			$('div.tooltip').hide();
		});

		//dynamically apply light tooltip data...
		$('.light_category li').each(function(i, li){
			li = $(li);
			var text = li.find('.txt').text();
			li.attr('rel', 'tooltip');
			li.attr('title', ('Drag & drop light or select and draw'));
		});

		//hide light tooltips on container scroll
		$('.light_category').on('scroll', function(){
			$('div.tooltip').hide();
		});

		//apply tooltips...
		$('[rel=tooltip]').tooltip({
			container: 'body',
			trigger: 'hover'
		});
	},

	get_dialog_position: function() {
		var designer_pos = app.designer.element.offset(),
		    designer_width = app.designer.element.width();

		return [
			designer_pos.left + (designer_width / 2) - 250,
			designer_pos.top + 50
		];
	}
};