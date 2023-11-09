<?php
include('./includes/headerType.php');

$path = ($_SERVER['HTTP_HOST'] == 'localhost:8000') ? './*.html' : '../../*.html';
$htmlFiles = glob($path);
$response = array_map('basename', $htmlFiles);

echo json_encode($response);