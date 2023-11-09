<?php
include('./includes/headerType.php');

if (file_exists($_FILES["image"]["tmp_name"]) && is_uploaded_file($_FILES["image"]["tmp_name"])) {
    $fileExt = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
    $fileName = uniqid() . "." . $fileExt;
    $uploadPath = ($_SERVER['HTTP_HOST'] == 'localhost:8000') ? "./upload_image/" : "../../upload_image/";

    if (!is_dir($uploadPath)) {
        mkdir($uploadPath, 0777, true);
    }

    move_uploaded_file($_FILES["image"]["tmp_name"], $uploadPath . $fileName);

    echo json_encode(["src" => $fileName]);
}


