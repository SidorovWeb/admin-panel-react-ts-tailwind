<?php
include('./includes/headerType.php');


$_POST = json_decode( file_get_contents("php://input"), true );
$list = "./backups/backups.json";


// if ($_POST["filename"]) {
//   $data = file_get_contents($list);
//   echo $data;
// } else {
//   header("HTTP/1.0 400 Bad Request");
// }

$data = file_get_contents($list);
echo $data;