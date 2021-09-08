<?php
    include 'default.php';
    if($_POST['type']=="user"){
        $sql="select * from `member` where `username`='".$_POST['txtAccount']."'";
    }
    else{
        $sql="select * from `host` where `email_host`='".$_POST['txtAccount']."'";
    }
    $result=$connect->query($sql);
    $res=[];
    while($row=$result->fetch_assoc()){
        $res[]=$row;
    }
    echo json_encode($res, JSON_PRETTY_PRINT);
    $connect->close();
?>