<script id="floorplan_upload_template" type="text/template">
	<br />
	<form method="post" enctype="multipart/form-data" action="/upload" target="floorplan_upload_frame_{{id_suffix}}" class="floorplan_upload_form">
        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
		<input type="hidden" name="new_project_name" class="add_area_project_name" />
		<input type="hidden" name="new_project_type" class="add_area_project_type" />
		<input type="hidden" name="is_new_project" class="is_new_project" />
		<input type="checkbox" class="has_floorplan" id="has_floorplan_{{id_suffix}}"/>
		<label class="has_floorplan_label" id="has_floorplan_label_{{id_suffix}}" for="has_floorplan_{{id_suffix}}">I have a floor plan to upload...</label>
		<br /><br />
		<div class="floorplan_upload_container">
			<div class='field'>
				<label for="floorplan_file_{{id_suffix}}">Floorplan file</label>
				<input type="file" id="floorplan_file_{{id_suffix}}" name="floorplan_file" class="floorplan_file" />
				(.pdf, .jpg, .jpeg, .png, .gif or .tiff only)
			</div>
			<div class='field floorplan_pdf_page_container'>
				<label for="floorplan_pdf_page_{{id_suffix}}">Page to import</label>
				<input type="number" id="floorplan_pdf_page_{{id_suffix}}" name="floorplan_pdf_page" class="floorplan_pdf_page" min="1" value="1" />
				<span class="small">(the page in the PDF which contains the actual floorplan)</span>
			</div>
		</div>
	</form>
	<iframe id="floorplan_upload_frame_{{id_suffix}}" name="floorplan_upload_frame_{{id_suffix}}" style="display:none"></iframe>
</script>