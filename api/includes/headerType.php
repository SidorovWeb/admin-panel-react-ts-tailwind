<?php
if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
  header('Content-Type: application/json');
  $method = $_SERVER['REQUEST_METHOD'];
  if ($method == "OPTIONS") {
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
  header("HTTP/1.1 200 OK");
  die();
  }
}

header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
header("Content-Type: text/html; charset=utf-8");
mb_internal_encoding('UTF-8');

session_start();  // turn on sessions


if(isset($_SESSION["auth"]) && $_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}


