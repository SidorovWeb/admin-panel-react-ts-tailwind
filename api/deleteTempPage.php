<?php
include('./includes/headerType.php');

if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    $file = "./jv38hffnkfknf_4i.html";
  } else {
    $file = "../../jv38hffnkfknf_4i.html";
  }


if (file_exists($file)) {
    unlink($file);
} else {
    header("HTTP/1.0 400 Bad Request");
}