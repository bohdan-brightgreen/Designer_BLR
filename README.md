# Designer_BLR
>>>>>>> f7f9ac443f4c5678be5cf9ee061b3d738430f209
# Issues Fixed
1) DSGN-11:  Add ceiling height:  For this enhancement, we have added codes in 'app\public\build\js\\app-9628e456c2.js', and 'app\resources\views\includes\ui\detail_panel_room.php.
2) DSGN-10:  Cannot export with large number of lights:  Because of overlapping of lights in sketch area when we are designing the room lights. Now we are finding the solution for that issue.
3) DSGN-6:  Cannot export large PDF:   Environment  isuue with BG
5) DSGN-7:	Lights misaligned in PDF export:  Environment  isuue with BG
6) DSGN-8:  Add a count for number of rooms of the design:  It is an enhancement, we have done with this issue. In a 'app\Services\PDFService.php' we have added a code.
7) DSGN-9:	Add total square meters of the design:    This enhancement not required, becuase it is already available.
8) DSGN-3	  Some lights cannot be selected:   "How to solve:
  1) The URL ""api.brightgreen.com"" is called to show the lights in assets and the response from the URL which is in JSON   format had some minor problem, So we have to update the JSON file to solve the issue. 

 What we did:
 1) We downloaded the response JSON file from URL ""api.brightgreen.com"" and cleared the errors in JSON file.
 2) And made a custom call API locally for lights and the bug is fixed.
 3) The corrected JSON file has to be replaced in URL ""api.brightgreen.com/brightgreen/v2/lights/details"" but we don't have   access to replace the corrected JSON. 
 4). We request source code access to the URL ""api.brightgreen.com/brightgreen/v2/lights/details"" to correct the JSON?

9) DSGN-13: 	Reflectivity slider:   	For this enhancement, we have added codes in 'app\public\build\js\\app-9628e456c2.js', and 'app\resources\views\includes\ui\detail_panel_room.php.
10) DSGN-15: 	Crash with too many rooms :  Environment  isuue with BG







