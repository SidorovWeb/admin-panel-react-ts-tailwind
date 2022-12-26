<?php
include('./includes/headerType.php');

if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
  $arrFiles = glob('./upload_image/*');
} else {
  $arrFiles = glob('../../upload_image/*');
}

$response = [];

foreach ($arrFiles as $file) {
  array_push($response ,basename($file));
}

echo json_encode($response);
