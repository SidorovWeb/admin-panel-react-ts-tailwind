<?php
include('./includes/headerType.php');
include('./includes/globTreeSearch.php');


$path = __DIR__ . '/';
$files = glob_tree_search($path, '*.zip');
echo json_encode($files);