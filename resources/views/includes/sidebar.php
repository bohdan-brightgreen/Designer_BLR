<div id='assets_container'>
	
	<div id='assets'>
		<div id="rooms_accordion_panel" style="display:none">
			<h3><a href="#">Rooms</a></h3>
			<div id="rooms_container">
				<p>To begin, simply click the button below to start drawing your rooms.</p>
				<div id='draw_room_check' class='buttonset' rel="tooltip" title="Click and draw Rooms" data-placement="right">
				  <input type="checkbox" id="draw_room" onclick="app.on_draw_room_click()" /><label for="draw_room">Draw Rooms</label>
				</div>
			</div>
		</div>
		<div style="display:none">
			<h3><a href="#">Furniture</a></h3>

			<!-- furniture -->
			<?php include('sidebar.assets.php'); ?>

		</div>
		<?php include('sidebar.lights.php'); ?>
	</div>
</div>