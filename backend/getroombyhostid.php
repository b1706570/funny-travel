<?php
    include 'default.php';
    $response = [];
    $listUnAvailable = [];
    // co dieu kien thi viet where vao
    $sql = "SELECT * FROM `rooms` WHERE `id_host`=".$_POST['id_host'];
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
    $sql1 = "SELECT `id_room` FROM `booking_schedule`";
    $result1 = $connect->query($sql1);
    while ($row1 = $result1->fetch_assoc()) {
        $listUnAvailable[] = $row1['id_room'];
    }
    $response[] = $listUnAvailable;
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>