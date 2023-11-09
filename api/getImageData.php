<?php
include('./includes/headerType.php');



$_POST = json_decode(file_get_contents("php://input"), true);
$stack = [];

$files = $_POST["imgList"];

if ($files) {
    foreach ($files as $file) {
        if (file_exists($file)) {
            $bytes = filesize($file);
            list($width, $height) = getimagesize($file);
            $parts = explode('.', $file);
            $extension = end($parts);
            $stack[] = ["size" => round($bytes / 1024), "width" => $width, "height" => $height, "extension" => $extension];
        } else {
            $stack[] = ["size" => 0, "width" => 0, "height" => 0, "extension" => 0];
        }
    }

    echo json_encode($stack);
} else {
    http_response_code(400);
}