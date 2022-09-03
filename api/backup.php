<?php
include('./includes/headerType.php');


$backups = json_decode(file_get_contents("./backups/backups.json"));
if (!is_array($backups)) {
  fopen('./backups/backups.json', "w");
}

