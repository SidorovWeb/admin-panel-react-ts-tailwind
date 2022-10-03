<?php
include('./includes/headerType.php');


if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
  $htmlFiles = glob('./*.html');
} else {
  $htmlFiles = glob('../../*.html');
}

$response = [];


foreach ($htmlFiles as $html) {
  array_push($response ,basename($html));
}

echo json_encode($response);