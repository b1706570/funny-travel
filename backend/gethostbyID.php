<?php
    include 'default.php';
    $sql="SELECT * FROM `host` WHERE `id_host`=".$_POST['id'];
    $result=$connect->query($sql);
    $response=[];
    while($row=$result->fetch_assoc()){
        $response[]=$row;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>