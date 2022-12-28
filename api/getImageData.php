<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );
$stack = array();
$files = $_POST["imgList"];

if ($files) {
foreach ($files as $file) {

  if (file_exists($file)) {
    $bytes = filesize($file);
    $width = getimagesize($file)[0];
    $height = getimagesize($file)[1];

    array_push($stack, ["size" => round($bytes / 1024),"width"  =>  $width , "height" => $height]);
  } else {
    array_push($stack, ["size" => 0,"width"  =>  0 , "height" => 0]);
  }
}

echo json_encode($stack);

} else {
  header("HTTP/1.0 400 Bad Request");
}
