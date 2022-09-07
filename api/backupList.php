<?php
include('./includes/headerType.php');


$_POST = json_decode( file_get_contents("php://input"), true );
$list = "./backups/backups.json";

$data = file_get_contents($list);
echo $data;