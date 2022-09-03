<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );

if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
  $newFile = "./temporaryFileCanBeDeleted.html";
} else {
  $newFile = "../../temporaryFileCanBeDeleted.html";
}


if ($_POST["html"]) {
  file_put_contents($newFile, $_POST["html"]);
} else {
  header("HTTP/1.0 400 Bad Request");
}