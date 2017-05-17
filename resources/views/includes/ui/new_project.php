<!-- new project dialog -->
<div id='new_project_dialog' class='new_project_dialog dialog dialog_pad' style="display:none;">
	<div class="new_project_columns">
		<div class="column">
			<div class='field'>
				<label for="new_project_name">Project name</label>
				<input type="text" id="new_project_name" name="new_project_name" placeholder="Project Name" required maxlength="50" />
			</div>
			<div class='field'>
				<label for="new_project_type">Property type</label>
				<select id="new_project_type" name="new_project_type">
					<option>Choose...</option>
					<option>Residential</option>
					<option>Commercial</option>
				</select>
			</div>
		</div>
		<div class="column">
			<div class="field">
				<label for="new_project_client">Client name</label>
				<input type="text" id="new_project_client" name="new_project_client" placeholder="Client Name" required maxlength="50" />
			</div>
			<div class='field'>
				<label for="new_project_client_email">Client email</label>
				<input type="text" id="new_project_client_email" name="new_project_client_email" placeholder="Client Email" required maxlength="50" />
			</div>
		</div>
	</div>
	<div id="new_project_floorplan">

	</div>
	<!--<br />
	<input type="checkbox" class="has_floorplan" id="has_floorplan_np"/>
	<label class="has_floorplan_label" id="has_floorplan_label_np" for="has_floorplan_np">I have a Floorplan to upload...</label>
	<br /><br />
	<div class="floorplan_upload_container">
		<div class='field'>
			<label for="floorplan_file_np">Floorplan file</label>
			<input type="file" id="floorplan_file_np" name="floorplan_file" />
		</div>
		<div class='field' class="floorplan_pdf_page_container">
			<label for="floorplan_pdf_page_np">Page to import</label>
			<input type="number" id="floorplan_pdf_page_np" name="floorplan_pdf_page" min="1" value="1" />
			<span class="small">(the page in the PDF which contains the actual floorplan)<span>
		</div>
	</div>
</form>
<iframe class="floorplan_upload_frame" id="floorplan_upload_frame_np" name="floorplan_upload_frame" style="display:none"></iframe>-->
</div>