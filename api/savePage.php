<?php
include('./includes/headerType.php');

$_POST = json_decode(file_get_contents("php://input"), true);

$pageName = $_POST["pageName"];
$newHTML = $_POST["html"];

if ($newHTML && $pageName) {
    $filePath = ($_SERVER['HTTP_HOST'] == 'localhost:8000') ? "./" . $pageName : "../../" . $pageName;
    file_put_contents($filePath, $newHTML);
} else {
    http_response_code(400);
}