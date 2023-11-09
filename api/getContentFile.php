<?php
include('./includes/headerType.php');



$_POST = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    $filename = "./" . $_POST["filename"];
} else {
    $filename = "../../" . $_POST["filename"];
}

if (isset($_POST["filename"]) && file_exists($filename)) {
    $data = file_get_contents($filename);
    echo $data;
} else {
    http_response_code(400);
}
