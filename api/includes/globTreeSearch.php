<?php
function glob_tree_search($path, $pattern, $_base_path = null)
{
	if (is_null($_base_path)) {
		$_base_path = '';
	} else {
		$_base_path .= basename($path) . '/';
	}

	$out = array();
	foreach(glob($path . '/' . $pattern, GLOB_BRACE) as $file) {
		$findme   = 'apsa/';
		$pos = strpos($_base_path . basename($file), $findme);

		if ($pattern === '*.js' || $pattern === '*.css') {
			if ($pos === false) {
				$out[] = $_base_path . basename($file);
			}
		} else {
			$out[] = $_base_path . basename($file);
		}
	}


	foreach(glob($path . '/*', GLOB_ONLYDIR) as $file) {
		$out = array_merge($out, glob_tree_search($file, $pattern, $_base_path));
	}


	return $out;
}
