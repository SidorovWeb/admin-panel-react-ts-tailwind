<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );



if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
  $filename = "./" . $_POST["filename"];
} else {
  $filename = "../../" . $_POST["filename"];
}

if ($_POST["filename"]) {
  $data = file_get_contents($filename);

  echo $data;
} else {
  header("HTTP/1.0 400 Bad Request");
}
