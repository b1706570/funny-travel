<?php
    include 'default.php';
    $sql="SELECT MIN(`price_room`) min FROM `rooms`";
    $sql1="SELECT MAX(`price_room`) max FROM `rooms`";
    $response=[];
    $result=$connect->query($sql);
    $result1=$connect->query($sql1);
    $row=$result->fetch_assoc();
    $response['min']=$row['min'];
    $row1=$result1->fetch_assoc();
    $response['max']=$row1['max'];
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>