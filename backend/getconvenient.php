<?php
    include 'default.php';
    $sql="SELECT * FROM `convenient` ORDER BY `id_conv` DESC";
    $res=[];
    $result=$connect->query($sql);
    while($row=$result->fetch_assoc()){
        $res[]=$row;
    }
    echo json_encode($res, JSON_PRETTY_PRINT);
    $connect->close();
?>