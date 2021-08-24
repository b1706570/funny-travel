<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    header("Content-Type: application/json");
    $connect=new mysqli("localhost","root","","travelDB");
    $connect->set_charset("UTF8");
?>