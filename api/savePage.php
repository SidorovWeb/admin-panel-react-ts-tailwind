<?php
include('./includes/headerType.php');

$_POST = json_decode( file_get_contents("php://input"), true );

$pageName = $_POST["pageName"];
$newHTML = $_POST["html"];

if (!is_dir('./backups/')) {
  mkdir('./backups/');
}

$backups = json_decode(file_get_contents("./backups/backups.json"));
if (!is_array($backups)) {
  fopen('./backups/backups.json', "w");
  $backups = [];
}

if ($newHTML  && $pageName) {
  $backupFileName = uniqid() .".html";

  if($_SERVER['HTTP_HOST'] == 'localhost:8000') {

    file_put_contents("./" . $pageName, $newHTML);
  } else {
    file_put_contents("../../" . $pageName, $newHTML);
  }

  if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    copy("./" . $pageName, './backups/' .  $backupFileName);
  } else {
    copy("../../" . $pageName, './backups/' .  $backupFileName);
  }


  array_push($backups, ['page' => $pageName, 'file' => $backupFileName, "time" => date("H:i:s d.m.y")]);
  file_put_contents("./backups/backups.json", json_encode($backups));

} else {
  header("HTTP/1.0 400 Bad Request");
}
