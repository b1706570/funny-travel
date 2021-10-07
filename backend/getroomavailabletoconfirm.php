<?php
    include 'default.php';
    $response = [];
    $sql = "SELECT `id_room`, `name_room` FROM `rooms` WHERE `type_room` = ".$_POST['type_room']." && `id_host` = ".$_POST['id_host']." && `id_room` NOT IN (SELECT `id_room` FROM `booking_schedule` WHERE `checkin_date` BETWEEN '".$_POST['checkin_date']."' AND '".$_POST['checkout_date']."' OR '".$_POST['checkin_date']."' BETWEEN `checkin_date` AND `checkout_date`)";
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        $response[] = $row; 
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>