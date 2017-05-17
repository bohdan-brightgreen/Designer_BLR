<div id="toolbar">
	<ul>
		<li id="deactivate_tool" class="ui-state-default ui-corner-all toggle_button toggle_button_pressed" onclick="app.designer.deactivate_tool()" rel="tooltip" data-placement="left" title="Default"><span class="ui-icon ui-icon-arrowthick-1-nw"></span></li>
		<li class="default ui-state-default ui-corner-all toggle_button" onclick="app.designer.toggle_tool('view.pan')" rel="tooltip" data-placement="left" title='Pan'><span class="ui-icon ui-icon-arrow-4"></span></li>
		<li class="default ui-state-default ui-corner-all" onclick="app.designer.zoom_to_fit()"  rel="tooltip" data-placement="left" title='Zoom to Fit'><span class="ui-icon ui-icon-arrow-4-diag"></span></li>
		<li class="default ui-state-default ui-corner-all" onclick="app.designer.zoom_in()" rel="tooltip" data-placement="left" title='Zoom in'><span class="ui-icon ui-icon-zoomin"></span></li>
		<li class="default ui-state-default ui-corner-all" onclick="app.designer.zoom_out()" rel="tooltip" data-placement="left" title='Zoom out'><span class="ui-icon ui-icon-zoomout"></span></li>

		<li  id="light_point" class="lights ui-state-default ui-corner-all toggle_button" onclick="app.designer.toggle_tool('light.draw.point')" rel="tooltip" data-placement="left" title='Draw Light point'><span class="ui-icon ui-icon ui-icon-plus"></span></li>
		<li class="lights ui-state-default ui-corner-all toggle_button" onclick="app.designer.toggle_tool('light.draw.grid')" rel="tooltip" data-placement="left" title='Draw Light grid'><span class="ui-icon ui-icon ui-icon-squaresmall-minus"></span></li>
		<li class="lights ui-state-default ui-corner-all toggle_button" onclick="app.designer.toggle_tool('light.draw.string')" rel="tooltip" data-placement="left" title='Draw Light string'><span class="ui-icon ui-icon ui-icon-pencil"></span></li>

		<li class="default light-selected ui-state-default ui-corner-all toggle_button" onclick="app.designer.toggle_tool('light.connect')" rel="tooltip" data-placement="left" title='Connect Light circuits'><span class="ui-icon ui-icon ui-icon-link"></span></li>
		<li class="default light-selected ui-state-default ui-corner-all toggle_button" onclick="app.designer.toggle_tool('light.disconnect')" rel="tooltip" data-placement="left" title='Disconnect Light circuits'><span class="ui-icon ui-icon ui-icon-cancel"></span></li>
	</ul>
</div>