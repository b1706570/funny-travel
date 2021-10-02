<?php
    include "default.php";
    $response = [];
    $transaction = [];
    $register = [];
    $toprevenue = [];
    $topbooking = [];
    $toprate = [];
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

    $sql2 = "SELECT SUM(t.`total_payment`) sum , h.`company_name`, h.`logo_host` FROM `transaction` t JOIN `rooms` r ON t.`id_room`=r.`id_room` JOIN `host` h ON r.`id_host`=h.`id_host` GROUP BY h.`id_host` ORDER BY sum DESC LIMIT 0,10";
    $result2 = $connect->query($sql2);
    while ($row2 = $result2->fetch_assoc()) {
        $toprevenue[] = $row2;
    }
    $response['toprevenue'] = $toprevenue;

    $sql3 = "SELECT COUNT(*) count , h.`company_name`, h.`logo_host` FROM `transaction` t JOIN `rooms` r ON t.`id_room`=r.`id_room` JOIN `host` h ON r.`id_host`=h.`id_host` GROUP BY h.`id_host` ORDER BY count DESC LIMIT 0,10";
    $result3 = $connect->query($sql3);
    while ($row3 = $result3->fetch_assoc()) {
        $topbooking[] = $row3;
    }
    $response['topbooking'] = $topbooking;

    $sql4 = "SELECT ROUND(AVG(e.`point`), 1) avg, h.`company_name` FROM `evaluate` e JOIN `host` h ON e.`id_host`=h.`id_host` GROUP BY e.`id_host` ORDER BY avg DESC LIMIT 0,10";
    $result4 = $connect->query($sql4);
    while ($row4 = $result4->fetch_assoc()) {
        $toprate[] = $row4;
    }
    $response['toprate'] = $toprate;

    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>