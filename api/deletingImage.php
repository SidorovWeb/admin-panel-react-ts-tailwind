<?php
include('./includes/headerType.php');



$_POST = json_decode(file_get_contents("php://input"), true);
$files = $_POST["arraySrc"];

foreach ($files as $file) {
    if (file_exists($file)) {
        unlink($file);
    } else {
        http_response_code(400);
    }
}

?>