<?php
    include 'default.php';
    $arrdata = [];
    $arrname = [];
    $response = [];
    $sql = "SELECT t.*, m.`fullname`, r.`name_room` FROM `transaction` t JOIN `rooms` r ON t.`id_room`=r.`id_room` JOIN `member` m ON t.`id_member`=m.`id_mem` WHERE t.`id_room` IN (SELECT `id_room` FROM `rooms` WHERE `id_host`=".$_POST['id_host'].")";
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
    $arrdata[] = $response;
    $result1 = $connect->query("SELECT `id_host`, `company_name` FROM `host` WHERE `email_host`=(SELECT `email_host` from `host` WHERE `id_host`=".$_POST['id_host'].") && `id_host` != ".$_POST['id_host']);
    while ( $row1 = $result1->fetch_assoc()){
        $arrname[] = $row1['company_name'];
        $res1 = [];
        $sql1 = "SELECT t.*, m.`fullname`, r.`name_room` FROM `transaction` t JOIN `rooms` r ON t.`id_room`=r.`id_room` JOIN `member` m ON t.`id_member`=m.`id_mem` WHERE t.`id_room` IN (SELECT `id_room` FROM `rooms` WHERE `id_host`=".$row1['id_host'].")";
        $result2 = $connect->query($sql1);
        while ($row2 = $result2->fetch_assoc()) {
            $res1[] = $row2;
        }
        $arrdata[] = $res1;
    }
    $dataResponse['branch'] = $arrname;
    $dataResponse['data'] = $arrdata;
    echo json_encode($dataResponse, JSON_PRETTY_PRINT);
    $connect->close();
?>