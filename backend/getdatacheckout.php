<?php
    include 'default.php';
    $response = [];
    $sql="SELECT * FROM `booking_schedule` b JOIN `rooms` r ON `b`.`id_room`=`r`.`id_room` WHERE `b`.`id_booking`=".$_POST['id_booking'];
    $result = $connect->query($sql);
    $row = $result->fetch_assoc();
    $response['id_member'] = $row['id_member'];
    $response['id_room'] = $row['id_room'];
    $response['fullname'] = $row['fullname'];
    $response['phone'] = $row['phone'];
    $response['name_room'] = $row['name_room'];
    $response['checkin_date'] = $row['checkin_date'];
    $response['checkout_date'] = $row['checkout_date'];
    $response['deposit'] = $row['deposit'];
    $response['price_room'] = $row['price_room'];
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>