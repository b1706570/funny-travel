<?php
    include 'default.php';
    $response = [];
    $res = [];
    $res1 = [];
    $result = $connect->query("SELECT * FROM `member` WHERE `id_mem`=".$_POST['id_member']);
    $response['info'] = $result->fetch_assoc();
    /////////////////////////////
    $sql = "SELECT t.*, r.`name_room`, r.`type_room`, h.`company_name`, h.`address_host`, h.`id_host` FROM `transaction` t JOIN `rooms` r ON t.`id_room`=r.`id_room` JOIN `host` h ON r.`id_host`=h.`id_host` WHERE t.`id_member`=".$_POST['id_member']." ORDER BY t.`checkin_date` DESC";
    $result2 = $connect->query($sql);
    while ($row = $result2->fetch_assoc()) {
        $res[] = $row;
    }
    $response['transaction'] = $res;

    $sql1 = "SELECT b.*, r.`name_room`, r.`type_room`, r.`price_room`,h.`company_name`, h.`address_host`, h.`id_host`  FROM `booking_schedule` b JOIN `rooms` r ON b.`id_room`=r.`id_room` JOIN `host` h ON r.`id_host`=h.`id_host` WHERE b.`id_member`=".$_POST['id_member']." ORDER BY b.`checkin_date` DESC";
    $result3 = $connect->query($sql1);
    while ($row1 = $result3->fetch_assoc()) {
        $res1[] = $row1;
    }
    $response['booking'] = $res1;
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>