<div id="image_crop_dialog" class="crop_dialog dialog_pad" style="display:none">
    <form id="crop_form" method="post" action="/image_crop" target="image_crop_frame">
        <div>
            Use the tool below to draw around the segment of the image that contains the floor plan:
            <br/><br/>
        </div>
        <div id="image_cropper"></div>
        <div class="crop_image_wrap">
            <span>Rotate:</span>
            <div class="crop_rotate_container">
                <div id="crop_rotate_slider"></div>
            </div>
        </div>
        <input type="hidden" id="crop_image_path" name="crop_image_path" />
        <input type="hidden" id="full_image_path" name="full_image_path" />
        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
        <input type="hidden" id="crop_data" name="crop_data" />
    </form>
    <iframe id="image_crop_frame" name="image_crop_frame" style="display:none"></iframe>
</div>