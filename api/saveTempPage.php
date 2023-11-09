<?php
include('./includes/headerType.php');

$_POST = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    $newFile = "./temporaryFileCanBeDeleted.html";
} else {
    $newFile = "../../temporaryFileCanBeDeleted.html";
}

if (!empty($_POST["html"])) {
    file_put_contents($newFile, $_POST["html"]);
} else {
    http_response_code(400);
}