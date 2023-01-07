<?php
include('./includes/headerType.php');

if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    if (!is_dir('./backups/')) {
        mkdir('./backups/');
      }
  } else {
    if (!is_dir('../../backups/')) {
        mkdir('../../backups/');
      }
  }



Class ZipArchiver {
    public static function zipDir($sourcePath, $outZipPath){
        $pathInfo = pathinfo($sourcePath);
        $parentPath = $pathInfo['dirname'];
        $dirName = $pathInfo['basename'];

        $z = new ZipArchive();
        $z->open($outZipPath, ZipArchive::CREATE);
        $z->addEmptyDir($dirName);
        if($sourcePath == $dirName){
            self::dirToZip($sourcePath, $z, 0);
        }else{
            self::dirToZip($sourcePath, $z, strlen("$parentPath/"));
        }
        $z->close();

        return true;
    }

    private static function dirToZip($folder, &$zipFile, $exclusiveLength){
        $handle = opendir($folder);
        while(FALSE !== $f = readdir($handle)){
            // Check for local/parent path or zipping file itself and skip
            if($f != '.' && $f != '..' && $f != basename(__FILE__)){
                $filePath = "$folder/$f";
                // Remove prefix from file path before add to zip
                $localPath = substr($filePath, $exclusiveLength);
                if(is_file($filePath)){
                    $zipFile->addFile($filePath, $localPath);
                }elseif(is_dir($filePath)){
                    // Add sub-directory
                    $zipFile->addEmptyDir($localPath);
                    self::dirToZip($filePath, $zipFile, $exclusiveLength);
                }
            }
        }
        closedir($handle);
    }

}

$zipper = new ZipArchiver;

// Path of the directory to be zipped
$dirPath = './';

// Path of output zip file
$zipPath = '';

if($_SERVER['HTTP_HOST'] == 'localhost:8000') {
    $zipPath = "./backups/" . date("d.m.y h:i:s") . ".zip";
  } else {
    $zipPath = "../../backups/" . date("d.m.y h:i:s") . ".zip";
  }
$zipFileName = date("d.m.y h:i:s") . ".zip";
// Create zip archive
$zip = $zipper->zipDir($dirPath, $zipPath);

if($zip){
    echo $zipFileName;
}else{
  header("HTTP/1.0 400 Bad Request");
}