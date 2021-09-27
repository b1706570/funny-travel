<?php
    include 'default.php';
    $response = [];
    if(isset($_POST['password'])){
        $password = md5($_POST['password']);
        $sql = "UPDATE `member` SET `username`='".$_POST['account']."',`password`='".$password."',`fullname`='".$_POST['fullname']."',`phone`='".$_POST['phone']."',`address`='".$_POST['address']."',`latitude`=".$_POST['latitude'].",`longtitude`=".$_POST['longtitude']." WHERE `id_mem`=".$_POST['id_member'];
    }
    else{
        $sql = "UPDATE `member` SET `username`='".$_POST['account']."',`fullname`='".$_POST['fullname']."',`phone`='".$_POST['phone']."',`address`='".$_POST['address']."',`latitude`=".$_POST['latitude'].",`longtitude`=".$_POST['longtitude']." WHERE `id_mem`=".$_POST['id_member']; 
    }
    if($connect->query($sql)){
        $response[] = array(
            "code" => 200,
            "message" => "Successfully!",
        );
    }
    else{
        $response[] = array(
            "code" => 500,
            "message" => "Server Error!",
        );
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>