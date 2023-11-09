<?php
include('./includes/headerType.php');

$_POST = json_decode(file_get_contents("php://input"), true);

$pathToFile = $_POST["pathToFile"];
$data = $_POST["data"];

if ($pathToFile && $data) {
    $filePath = ($_SERVER['HTTP_HOST'] == 'localhost:8000') ? "./" . $pathToFile : "../../" . $pathToFile;
    file_put_contents($filePath, $data);
} else {
    http_response_code(400);
}