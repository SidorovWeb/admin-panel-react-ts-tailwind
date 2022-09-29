<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );

$pathToFile = $_POST["pathToFile"];
$data = $_POST["data"];


if ($pathToFile  && $data) {
  if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    file_put_contents("./" . $pathToFile, $data);
  } else {
    file_put_contents("../../" . $pathToFile, $data);
  }

} else {
  header("HTTP/1.0 400 Bad Request");
}
