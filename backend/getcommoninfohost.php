<?php
    include 'default.php';
    $response = [];
    $sql = "SELECT `fullname_host`, `company_name`, `email_host`, `phone_host`, `address_host`, `logo_host`, `latitude`, `longtitude` FROM `host` WHERE `id_host`=".$_POST['id_host'];
    $result = $connect ->query($sql);
    $row = $result->fetch_assoc();
    $response['common_info'] = $row;
    $sql1 = "SELECT ROUND(AVG(`point`),0) point, COUNT(`point`) number FROM `evaluate` WHERE `id_host`=".$_POST['id_host']; 
    $result1 = $connect->query($sql1);
    $row1 = $result1->fetch_assoc();
    $response['point'] = $row1;
    $res = [];
    $sql2 = "SELECT * FROM `rooms` WHERE `id_host`=".$_POST['id_host'];
    $result2 = $connect->query($sql2);
    while($row2=$result2->fetch_assoc()) {
        $res[] = $row2;
    }
    $response['rooms'] = $res;
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>