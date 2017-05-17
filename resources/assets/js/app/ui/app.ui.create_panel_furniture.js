/**
 * app.ui.create_panel_furniture
 * Panel to add furniture to designer
 *
 */
app.ui.create_panel_furniture = {
	element: null,

	init: function() {
		this.element = $('#add_furniture_panel');

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

	show: function() {
		this.element.show();
	}
};