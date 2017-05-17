<?php

namespace Datasheets\Services;



use FPDI;



class DatasheetService

{

    private $url;

    private $datasheetPath;



    public function __construct()

    {

        $this->url = 'http://' . env('DATASHEET_HOST', 'services.brightgreen.com') . '/file/';

        $this->datasheetPath = base_path() . '/../services.brightgreen.com/storage/datasheets/';

    }



    /*

     * $products = ['brightgreen' => [1,10,15], 'map' => [1,77]];

     */

    public function extend($name = 'Brightgreen_datasheet', array $files = [], array $products = [])

    {

        $datasheets = $this->datasheetFiles($products);

        $combined = array_merge($files, $datasheets);



        $this->merge($combined, $name);



        return true;

    }



    private function datasheetFiles(array $products = [])

    {

        $result = [];

        $order = ['brightgreen', 'map'];



        foreach ($order as $type) {

            if (empty($products[$type])) {

                continue;

            }



            foreach ($products[$type] as $id) {

                $filename = $this->getDatasheetFilename($id, $type);

                if (empty($filename)) {

                    continue;

                }



                $result[] = $this->datasheetPath . $filename;

            }

        }



        return $result;

    }



    private function merge(array $files = [], $name = 'Brightgreen_datasheet')

    {
        $outputFile="";

        $this->outputFile = storage_path() . '/pdf/' . $name . '.pdf';



        /*$cmd = (env('APP_ENV') == 'local') ? 'gswin64' : 'gs';

        $cmd .= ' -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="' . $outputFile . '" ' . implode(' ', $files);

        exec($cmd);*/



        $pdf = new FPDI();



        //foreach ($files as $file) {

            $this->pageCount = $pdf->setSourceFile($files[0]);

            for ($pageNo = 1; $pageNo <= $this->pageCount; $pageNo++) {

                $tplIdx = $pdf->ImportPage($pageNo);

                $size = $pdf->getTemplatesize($tplIdx);

                $pdf->AddPage($size['w'] > $size['h'] ? 'L' : 'P', [$size['w'], $size['h']]);

                $pdf->useTemplate($tplIdx);

            }

        //}



        $pdf->Output($this->outputFile, 'F');

    }



	private function getDatasheetFilename($id, $type)

    {

		$ch = curl_init();

		curl_setopt($ch, CURLOPT_URL, $this->url . $id . '/' . $type);

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

		curl_setopt($ch, CURLOPT_HEADER, false);

		curl_setopt($ch, CURLOPT_POST, false);



		$result = curl_exec($ch);

		curl_close($ch);



        return $result;

	}

}