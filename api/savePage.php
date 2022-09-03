<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );

$file = $_POST["pageName"];
$newHTML = $_POST["html"];
if (!is_dir('./backups/')) {
  mkdir('./backups/');
}
$backups = json_decode(file_get_contents("./backups/backups.json"));
if (!is_array($backups)) {
  $backups = [];
}


if ($newHTML  && $file) {
  $backupFileName = uniqid() .".html";

  if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    copy("./" . $file, './backups/' .  $backupFileName);
  } else {
    copy("../../" . $file, './backups/' .  $backupFileName);
  }


  array_push($backups, ['page' => $file, 'file' => $backupFileName, "time" => date("H:i:s d.m.y")]);
  file_put_contents("./backups/backups.json", json_encode($backups));

  if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    file_put_contents("./" . $file, $newHTML);
  } else {
    file_put_contents("../../" . $file, $newHTML);
  }
} else {
  header("HTTP/1.0 400 Bad Request");
}