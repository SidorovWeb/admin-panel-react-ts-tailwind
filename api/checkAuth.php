<?php
include('./includes/headerType.php');

if(isset($_SESSION["auth"]) && $_SESSION["auth"] == true) {
    echo json_encode( array("auth" => true) );
} else {
    echo json_encode( array("auth" => false) );
}