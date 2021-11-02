<?php
    include 'default.php';
    if($_POST['type']=='member'){
        $res = $connect->query("SELECT max(`id_mem` + 1) id FROM `member` WHERE `id_mem` < 10000000");
        $row = $res->fetch_assoc();
        $password=md5($_POST['txtPassword']);
        $sql="INSERT INTO `member`(`id_mem`, `username`, `password`, `fullname`, `phone`, `address`,`latitude`,`longtitude`) VALUES 
        (".$row['id'].",'".$_POST['txtAccount']."','".$password."','".$_POST['txtFullname']."','".$_POST['txtPhone']."','".$_POST['txtAddress']."',".$_POST['lat'].",".$_POST['lng'].")";
    }
    else{
        $sql="INSERT INTO `proposal`(`fullname`, `company`, `email`, `phone`, `address`, `state`, `latitude`,`longtitude`) VALUES 
        ('".$_POST['txtFullname']."','".$_POST['txtHostname']."','".$_POST['txtGmail']."',".$_POST['txtPhonenumber'].",'".$_POST['txtAddress']."','".$_POST['state']."',".$_POST['lat'].",".$_POST['lng'].")";
    }
    $result=array();
    if($connect->query($sql)){
        $result[]= array(
            "message" => "Successfully!",
            "code" => 200
        );
    }
    else{
        $result[]= array(
            "message" => "Server Error!",
            "code" => 500
        );
    }
    echo json_encode($result, JSON_PRETTY_PRINT);
    $connect->close();
?>