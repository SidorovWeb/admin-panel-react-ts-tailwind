<?php
include('./includes/headerType.php');

if ($_SESSION["auth"] == true) {
    $_SESSION["auth"] = false;
    unset($_SESSION["auth"]);
    session_destroy();
}