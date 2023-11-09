<?php
include('./includes/headerType.php');
include('./includes/globTreeSearch.php');



$path = ($_SERVER['HTTP_HOST'] == 'localhost:8000') ? __DIR__ . '/' : '../../backups/';
$files = glob_tree_search($path, '*.zip');
echo json_encode($files);

?>