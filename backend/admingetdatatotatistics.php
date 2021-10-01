<?php
    include "default.php";
    $response = [];
    $transaction = [];
    $register = [];
    $sql = "SELECT t.*, r.`name_room`, h.`company_name`, h.`logo_host` FROM `transaction` t JOIN `rooms` r ON t.`id_room`=r.`id_room` JOIN `host` h ON r.`id_host`=h.`id_host`";
    $result = $connect->query($sql);
    while ($row=$result->fetch_assoc()) {
        $transaction[] = $row;
    }
    $response['transaction'] = $transaction;

    $sql1 = "SELECT `registration_date` FROM `member`";
    $result1 = $connect->query($sql1);
    while ($row1=$result1->fetch_assoc()) {
        $register[] = $row1['registration_date'];
    }
    $response['register'] = $register;
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>