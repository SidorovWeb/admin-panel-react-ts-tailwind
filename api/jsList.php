<?php
include('./includes/headerType.php');
include('./includes/globTreeSearch.php');


if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
  $path = __DIR__ . '/';
} else {
  $path = '../../';
}



$files = glob_tree_search($path, '*.js');
echo json_encode($files);
