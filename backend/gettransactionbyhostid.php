<?php
    include 'default.php';
    $response = [];
    $sql = "SELECT * FROM `transaction` WHERE `id_room` IN (SELECT `id_room` FROM `rooms` WHERE `id_host`=".$_POST['id_host'].")";
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>