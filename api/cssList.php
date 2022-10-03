<?php
include('./includes/headerType.php');
include('./includes/globTreeSearch.php');

$path = __DIR__ . '/';
$files = glob_tree_search($path, '*.css');
echo json_encode($files);
