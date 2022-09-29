<?php
include('./includes/headerType.php');


function glob_tree_search($path, $pattern, $_base_path = null)
{
	if (is_null($_base_path)) {
		$_base_path = '';
	} else {
		$_base_path .= basename($path) . '/';
	}

	$out = array();
	foreach(glob($path . '/' . $pattern, GLOB_BRACE) as $file) {
		$out[] = $_base_path . basename($file);
	}

	foreach(glob($path . '/*', GLOB_ONLYDIR) as $file) {
		$out = array_merge($out, glob_tree_search($file, $pattern, $_base_path));
	}

	return $out;
}

$path = __DIR__ . '/';
$files = glob_tree_search($path, '*.js');
echo json_encode($files);
