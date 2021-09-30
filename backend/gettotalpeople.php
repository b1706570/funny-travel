<?php
    include 'default.php';
    $response = [];
    if($_POST['type'] == "member"){
        $result = $connect->query("SELECT COUNT(*) co FROM `member`");
        $row = $result->fetch_assoc();
        $response['member'] = $row['co'];

        $result1 = $connect->query("SELECT COUNT(*) co FROM `transaction` WHERE `state`='DATHANHTOAN'");
        $row1 = $result1->fetch_assoc();
        $response['booking'] = $row1['co'];

        $result2 = $connect->query("SELECT COUNT(DISTINCT `id_member`) co FROM `transaction` WHERE `state`='DATHANHTOAN'");
        $row2 = $result2->fetch_assoc();
        $response['active'] = $row2['co'];
    }
    else{
        $result = $connect->query("SELECT COUNT(*) co FROM `host`");
        $row = $result->fetch_assoc();
        $response['member'] = $row['co'];

        $result1 = $connect->query("SELECT COUNT(*) co FROM `transaction` WHERE `state`='DATHANHTOAN'");
        $row1 = $result1->fetch_assoc();
        $response['booking'] = $row1['co'];

        $result2 = $connect->query("SELECT COUNT(*) co FROM `rooms`");
        $row2 = $result2->fetch_assoc();
        $response['room'] = $row2['co'];
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>