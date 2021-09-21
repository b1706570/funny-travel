<?php
    include 'default.php';
    $response = [];
    $sql = "SELECT t.*, m.`fullname`, r.`name_room` FROM `transaction` t JOIN `rooms` r ON t.`id_room`=r.`id_room` JOIN `member` m ON t.`id_member`=m.`id_mem` WHERE t.`id_room` IN (SELECT `id_room` FROM `rooms` WHERE `id_host`=".$_POST['id_host'].")";
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>