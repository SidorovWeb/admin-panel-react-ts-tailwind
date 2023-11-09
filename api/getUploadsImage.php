<?php
include('./includes/headerType.php');



if ($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    $path = './upload_image/*';
} else {
    $path = '../../upload_image/*';
}

$arrFiles = glob($path);
$response = [];

foreach ($arrFiles as $file) {
    $response[] = basename($file);
}

echo json_encode($response);
