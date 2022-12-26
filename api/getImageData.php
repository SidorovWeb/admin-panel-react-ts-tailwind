<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );
$stack = array();

if ($_POST["imgList"]) {

foreach ($_POST["imgList"] as $img) {
  $image = get_headers($img, 1);
  $bytes = $image["Content-Length"];
  $width = getimagesize($img)[0];
  $height = getimagesize($img)[1];

  // if (isset($_FILES[$img])) {
  //   $width = getimagesize($img)[0];
  //   $height = getimagesize($img)[1];
  // } else {
  //   $width = 0;
  //   $height = 0;
  // }

  array_push($stack, ["size" => round($bytes / 1024),"width"  =>  $width , "height" => $height]);
}

echo json_encode($stack);

} else {
  header("HTTP/1.0 400 Bad Request");
}
