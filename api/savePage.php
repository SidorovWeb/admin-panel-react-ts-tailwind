<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );

$pageName = $_POST["pageName"];
$newHTML = $_POST["html"];

if ($newHTML  && $pageName) {
  if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    file_put_contents("./" . $pageName, $newHTML);
  } else {
    file_put_contents("../../" . $pageName, $newHTML);
  }
} else {
  header("HTTP/1.0 400 Bad Request");
}
