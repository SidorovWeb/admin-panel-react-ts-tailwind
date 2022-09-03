<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );
$page = $_POST["page"];
$file = $_POST["file"];

if ($page && $file) {
  copy("./backups/" .  $file, $page);
} else {
  header("HTTP/1.0 400 Bad Request");
}