<ul id="menubar">
	<li><h3><a href="">Lighting designer</a></h3></li>
	<li><a href="#">File</a>
		<ul>
			<li><a href="#" onclick="app.show_new_dialog()">New...</a></li>
			<li><a href="#" onclick="app.show_open_dialog()">Open...</a></li>
			<li><a href="#" onclick="app.save_project()">Save</a></li>
			<li><a href="#" id='toggle_tooltips' onclick="app.toggle_tooltips()">Enable Tooltips</a></li>
		</ul>
	</li>
	<li><a href="#">Export</a>
		<ul>
			<li><a href="#" onclick="app.designer.export_image()">Export Image</a></li>
			<li><a href="#" onclick="app.show_pdf_notes_dialog()">Generate PDF</a></li>
		</ul>
	</li>
	<img src="img/bg_logo.png" class="bg_logo" />
</ul>
