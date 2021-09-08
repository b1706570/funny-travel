<?php
    include 'default.php';
    $response = [];
    $sql="SELECT `id_host`, `company_name` FROM `host` WHERE `email_host` = (SELECT `email_host` FROM `host` WHERE `id_host` = ".$_POST['id_host'].")";
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>