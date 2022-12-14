<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );
$stack = array();

if ($_POST["imgList"]) {
foreach ($_POST["imgList"] as $img) {
  $image = get_headers($img, 1);
  $bytes = $image["Content-Length"];
  array_push($stack, round($bytes / 1024));
}

echo json_encode($stack);

} else {
  header("HTTP/1.0 400 Bad Request");
}
