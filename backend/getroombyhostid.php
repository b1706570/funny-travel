<?php
    include 'default.php';
    $response = [];
    $listUnAvailable = [];
    $prepare = [];
    if(isset($_POST['type-room'])){
        $sql = "SELECT * FROM `rooms` WHERE `id_host`=".$_POST['id_host']." && `type_room` = ".$_POST['type-room']." ORDER BY `name_room`"; 
    }
    else{
        $sql = "SELECT * FROM `rooms` WHERE `id_host`=".$_POST['id_host']." ORDER BY `name_room`";
    }
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }

    $checkin = $_POST['checkin'];
    $checkin = $checkin." 12:01:00";
    $checkout = $_POST['checkout'];
    $checkout = $checkout." 12:00:00";


    $listUnAvailable = [];
    $checkout_time = [];
    $id_checkin = [];
    $sql1 = "SELECT `id_room`,`checkout_date`,`id_booking` FROM `booking_schedule` WHERE ('".$checkout."' BETWEEN `checkin_date` and `checkout_date` OR `checkout_date` BETWEEN '".$checkin."' AND '".$checkout."') AND `state`='DANHANPHONG'";
    $result1 = $connect->query($sql1);
    while ($row1 = $result1->fetch_assoc()) {
        $listUnAvailable[] = $row1['id_room'];
        $checkout_time[] = $row1['checkout_date'];
        $id_checkin[] = $row1['id_booking'];
    }
    $response[] = $listUnAvailable;
    $response[] = $checkout_time;
    $response[] = $id_checkin;


    $prepare = [];
    $checkin_time = [];
    $id_checkout = [];
    $sql2 = "SELECT `id_room`,`checkin_date`,`id_booking` FROM `booking_schedule` WHERE ('".$checkin."' BETWEEN `checkin_date` and `checkout_date` OR `checkin_date` BETWEEN '".$checkin."' AND '".$checkout."') AND `state`='DAXACNHAN'";
    $result2 = $connect->query($sql2);
    while ($row2 = $result2->fetch_assoc()) {
        $prepare[] = $row2['id_room'];
        $checkin_time[] = $row2['checkin_date'];
        $id_checkout[] = $row2['id_booking'];
    }
    $response[] = $prepare;
    $response[] = $checkin_time;
    $response[] = $id_checkout;
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>