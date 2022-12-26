<?php
include('./includes/headerType.php');

if(file_exists($_FILES["image"]["tmp_name"]) && is_uploaded_file($_FILES["image"]["tmp_name"])) {
  $fileExt = explode("/", $_FILES["image"]["type"])[1];
  $fileName = uniqid() . "." . $fileExt;

    if(!is_dir("./upload_image/")) {
      mkdir("./upload_image/");
    }
    move_uploaded_file($_FILES["image"]["tmp_name"], "./upload_image/" . $fileName);


  echo json_encode( array("src" => $fileName));
}


