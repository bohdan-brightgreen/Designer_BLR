<!-- room settings dialog -->

<div id="room_details_panel" class='details_panel' style="display:none">

	<div class="collapsible expanded">

		<a href="javascript:void(0);" class="collapsible_header no_border">Options</a>

		<div class="collapsible_content small_pad">

			<div class='line_field'>

				<label class="field_label" for="room_type">Room type</label>

				<div class="field_value">

					<select id="room_type">

						<option>Select...</option>

					</select>

				</div>

			</div>

			<div class='line_field'>

				<label class="field_label" for="room_name">Room name</label>

				<div class="field_value">

					<input type="text" id="room_name" required maxlength="20"  placeholder="Room name"/>

				</div>

			</div>

			<div id="reflectivity_slider_container" class='line_field'>


				<div> Ceiling Height </div>
				

				<input type="number" step="0.1" id="ceiling_height" class="wall_length" min="0" max="100"  />

			</div>



			



			<div class='line_field'>

				<label class="field_label" for="color_temp">Room colour</label>

				<div class="field_value">

					<select id="color_temp">

						<option>Cool</option>

						<option>Warm</option>

					</select>

				</div>

			</div>

			<!-- <div class='line_field'>

				<label class="field_label" for="reflectivity">Reflectivity</label>

				<div class="field_value">

					<select id="reflectivity">

						<option>Light</option>

						<option>Medium</option>

						<option>Dark</option>

					</select>

				</div>

			</div>
 -->		
			<div id="reflectivity_slider_container" class='field slider_field'>

				<div>Reflectivity</div>

				<div id='reflectivity_slider' class='wall_length_slider'></div>

				<input type="number" step="0.1" id="reflectivity" class="wall_length" min="0" max="100"  />

			</div>

			<div id="wall_length_slider_container" class='field slider_field'>

				<div>Length of the dashed wall (estimate in meters)</div>

				<div id='wall_length_slider' class='wall_length_slider'></div>

				<input type="number" step="0.1" id="wall_length" class="wall_length" min="0" max="100"  />

			</div>

		</div>

	</div>

</div>