<?php
include('./includes/headerType.php');
include('./includes/globTreeSearch.php');


if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
  $path = __DIR__ . '/';
} else {
  $path = '../../backups/';
}
$files = glob_tree_search($path, '*.zip');
echo json_encode($files);

