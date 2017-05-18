<?php

namespace App\Services;



/**

 * Lighting designer - Project. PDF & image related  functions (upload, crop, resize etc..)

 * Please make sure ImageMagick is installed, and the 'convert' program is accesible in your %PATH%

 * (this requires ghostscript (gs) to also be accesible in your path)

 *

 */

class FloorplanService

{

    protected $uploadsPath = '';

    protected $outputPath = '';

    protected $imageOutputType = 'gif';

    protected $thumbnailWidth = 400;



    public function __construct(

    ) {

        //$this->uploadsPath = 'uploads/originals/';

        //$this->outputPath = 'uploads/backgrounds/';

        $this->uploadsPath = storage_path() . '/uploads/floorplans/';

        $this->outputPath = 'uploads/floorplans/';

    }



    /**

     * Initial process upload function

     */

    public function process_floorplan_upload($request)

    {

        //$project_name = $request['new_project_name'];

        //$project_type = $request['new_project_type'];

        $guid = uniqid();



        $file = $request['floorplan_file'];

        $ext = $file->guessExtension();

        $filename = $guid . '.' . $ext;

        //$fullOutputPath = $this->outputPath . $filename;



        $is_pdf = ($ext === 'pdf');



        // Validate...

        $result = $this->validate_floorplan($file);

        $success = $result[0];



        // Upload...

        if ($success) {

            $result = $this->upload_floorplan($file, $filename);

            $success = $result[0];

        }



        // Upload successful - extract image...

        if ($success) {

            $img_filename = ($this->outputPath . $guid . '.' . $this->imageOutputType);



            // If PDF extract page...

            if ($is_pdf) {

                $page = intval($request['floorplan_pdf_page']) - 1;

                if ($page < 0) {

                    $page = 0;

                }

                $result = $this->extract_pdf_page($this->uploadsPath . $filename, $page, $img_filename);

                $success = $result[0];



            } else {

                // Not PDF,

                // Copy image to output location

                copy($this->uploadsPath . $filename, $img_filename);

            }



            // Extract successful - create thumbnail...

            if (!$is_pdf || ($is_pdf && $success)) {

                $thumb_filename = ($this->outputPath . $guid . '.thumb.' . $this->imageOutputType);
                //$image_NEW = "C:/wampserver/wamp64/www/kiko.designer.master/public/uploads/floorplans/58b3f514bcec1.gif";
                  $result = $this->create_image_thumbnail($img_filename, $thumb_filename);
				
                 //$result = $this->make_thumb($img_filename, $thumb_filename,$this->thumbnailWidth);
                $success = $result[0];



                // Return success...

                if ($success) {

                    return [true, ['thumbnail' => $thumb_filename, 'image' => $img_filename]];

                }

            }

        }



        // Error fallthrough...

        return $result;

    }



    /**

     * Validate file

     */

    public function validate_floorplan($file)

    {

        $allowedTypes = ['pdf', 'gif', 'tiff', 'png', 'jpg', 'jpeg'];

        $ext = $file->guessExtension();



        if (!$file->isValid()) {

            return [false, $file->getErrorMessage()];



        } elseif (!in_array($ext, $allowedTypes)) {

            return [false, 'Invalid file type. Supported types: ' . implode(', ', $allowedTypes)];

        }



        return [true];

    }



    /**

     * Upload file & move to connect directory

     */

    public function upload_floorplan($file, $name)

    {

        // Move temporary file to uploads directory...

        if ($file->move($this->uploadsPath, $name)) {

            return [true];



        } else {

            return [false, 'Could not move uploaded file.'];

        }

    }



    /**

     * Extract PDF page into image

     */

    public function extract_pdf_page($pdf, $page, $image)

    {

        $greyscale = "-set colorspace Gray -separate -average";

        $command = "convert -density 100% -quality 85 -background white -flatten -trim +repage -alpha on {$greyscale} {$pdf}[{$page}] {$image}";



        return $this->convert('PDF', $command);

    }



    /**

     * Create image thumb

     */

    public function create_image_thumbnail($image, $thumbnail)

    {

        $greyscale = "-set colorspace Gray -separate -average";
       
        $command = "convert -thumbnail {$this->thumbnailWidth} {$greyscale} {$image} {$thumbnail}";



        return $this->convert('thumbnail', $command);

    }



    /**

     * Run Imagick command and return result

     */
	 function make_thumb($src, $dest, $desired_width) {

	/* read the source image */
	$source_image = imagecreatefromjpeg($src);
	
	$width = imagesx($source_image);
	
	$height = imagesy($source_image);
	
	/* find the "desired height" of this thumbnail, relative to the desired width  */
	$desired_height = floor($height * ($desired_width / $width));
	
	/* create a new, "virtual" image */
	$virtual_image = imagecreatetruecolor($desired_width, $desired_height);
	
	/* copy source image at a resized size */
	imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
	
	/* create the physical thumbnail image to its destination */
	imagegif($virtual_image, $dest);
	
	return [true];
}

 function make_crop($src,$dest,$x,$y,$w,$h){
 
 $im = imagecreatefromjpeg($src);
//$size = min(imagesx($im), imagesy($im));
$im2 = imagecrop($im, ['x' => $x, 'y' => $y, 'width' => $w, 'height' => $h]);
if ($im2 !== FALSE) {
    imagegif($im2,$dest);
return [true];
}else{
return [false];
}
 }

    private function convert($type, $command)

    {

        $errors = [];

        $result = 0;

        $output = exec($command, $errors, $result);
		//$output = shell_exec($command);
		



        if ($result != 0) {

            $message = 'A conversion error has occured (' . $type . ')';

            if (count($errors) > 0) {

                $message .= ': ' . $errors[1];

            }



            return [false,  $message];

        }



        // Success...

        return [true];

    }



    /**

     * Crop image

     */

    public function crop_image($request)

    {

        $cropImage = $request['crop_image_path'];

        $image = $request['full_image_path'];
		
      
        $output = str_replace(('.' . $this->imageOutputType), ('.crop.' . $this->imageOutputType), $image);
 echo '<script type="text/javascript">alert("' . $output . '")</script>';  


        list($width, $height, $type, $attr) = getimagesize($image);

        $ratio = $width / $this->thumbnailWidth;



        $cropData = json_decode($_POST['crop_data'], true);



        $x = floatval($cropData['x']) * $ratio;

        $y = floatval($cropData['y']) * $ratio;

        $w = floatval($cropData['width']) * $ratio;

        $h = floatval($cropData['height']) * $ratio;

        $rotate = floatval($cropData['rotate']);



        $greyscale = "-set colorspace Gray -separate -average";

        $command = "convert -rotate {$rotate} +repage -crop {$w}x{$h}+{$x}+{$y} +repage {$greyscale} {$image} {$output}";

        $result = $this->convert('crop', $command);
		//$result = $this-> make_crop($image, $output,$x,$y,$w,$h);

        $success = $result[0];



        if ($success) {

            // Remove previous image...

            unlink($image);

            unlink($cropImage);

            rename($output, $image);



            return [true, $image];

        }



        return $result;

    }
	

}

