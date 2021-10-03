<?php
    include 'default.php';
    $sql = "SELECT * FROM `report` r JOIN `member` m ON r.`id_reporter`=m.`id_mem` WHERE r.`id_comment`=".$_POST['id_comment'];
    $result=$connect->query($sql);
    $response=[];
    while($row=$result->fetch_assoc()){
        $response[]=$row;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>