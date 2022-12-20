<?php
include('./includes/headerType.php');
include('./includes/globTreeSearch.php');

$path = __DIR__ . '/';
$response = [];
$html = glob_tree_search($path, '*.html');
array_push($response ,['html' => $html]);

$css = glob_tree_search($path, '*.css');
array_push($response ,['css' => $css]);

$js = glob_tree_search($path, '*.js');
array_push($response ,['js' => $js]);

$backup = glob_tree_search($path, '*.zip');
array_push($response ,['backup' => $backup]);






echo json_encode($response);
