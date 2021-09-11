<?php
    include 'default.php';
    $response = [];
    $listUnAvailable = [];
    $prepare = [];
    $sql = "SELECT * FROM `rooms` WHERE `id_host`=".$_POST['id_host']." ORDER BY `name_room`";
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }

    $today = date("Y-m-d");
    $today = $today." 12:00:00";
    $sql1 = "SELECT `id_room` FROM `booking_schedule` WHERE '".$today."' BETWEEN `checkin_date` and `checkout_date`";
    $result1 = $connect->query($sql1);
    while ($row1 = $result1->fetch_assoc()) {
        $listUnAvailable[] = $row1['id_room'];
    }
    $response[] = $listUnAvailable;

    $today1 = date("Y-m-d");
    $today1 = $today1." 12:01:00";
    $sql2 = "SELECT `id_room` FROM `booking_schedule` WHERE '".$today1."' = `checkin_date`";
    $result2 = $connect->query($sql2);
    while ($row2 = $result2->fetch_assoc()) {
        $prepare[] = $row2['id_room'];
    }
    $response[] = $prepare;
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>