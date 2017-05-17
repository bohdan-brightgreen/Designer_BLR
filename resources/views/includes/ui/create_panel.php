<div id="create_panel" style="display: none">
	<ul id="create_panel_tabs">
		<li id="add_rooms" class="togglable"><a href="javascript:void(0);" class="btn" title="Add Rooms">Draw Room</a></li>
		<li id="add_furniture" class="togglable"><a href="javascript:void(0);" class="btn" title="Add Furniture">Add Furniture</a></li>
		<li id="add_lights" class="togglable"><a href="javascript:void(0);" class="btn" title="Lighting Design">Lighting Design</a></li>
	</ul>

	<div id="panel_contents" class="bg_dialog">
		<?php 
		include('create_panel_rooms.php');
		include('create_panel_furniture.php');
		include('create_panel_lights.php');
		?>
	</div>
</div>