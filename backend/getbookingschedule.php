<?php
    include 'default.php';
    $response = [];
    if(isset($_POST['id_host'])){
        $sql = "SELECT b.*, m.`fullname`, m.`phone` FROM `booking_schedule` b JOIN `member` m ON b.`id_member` = m.`id_mem` WHERE b.`id_host` = ".$_POST['id_host']." AND b.`state`='CHOXACNHAN'";
        $sql1 = "SELECT * FROM `booking_schedule` b JOIN `rooms` r ON b.`id_room`=r.`id_room` JOIN `member` m ON b.`id_member` = m.`id_mem` WHERE b.`id_host` = ".$_POST['id_host']." AND b.`state`='DAXACNHAN'";
        $result=$connect->query($sql);
        $result1=$connect->query($sql1);
        $res = [];
        while ($row=$result->fetch_assoc()) {
            $res[] = $row;
        }
        $res1 = [];
        while ($row1=$result1->fetch_assoc()) {
            $res1[] = $row1;
        }
        $response['listAwait'] = $res;
        $response['listConfirmed'] = $res1;
    }
    else{
        $checkin = $_POST['checkin']." 12:01:00";
        $checkout = $_POST['checkout']." 12:00:00";
        $sql = "SELECT `id_room` FROM `booking_schedule` WHERE ('".$checkin."' BETWEEN `checkin_date` AND `checkout_date`) 
        OR ('".$checkout."' BETWEEN `checkin_date` AND `checkout_date`) 
        OR (`checkin_date` BETWEEN '".$checkin."' AND '".$checkout."') 
        OR (`checkout_date` BETWEEN '".$checkin."' AND '".$checkout."')";
        $result=$connect->query($sql);
        while ($row=$result->fetch_assoc()) {
            $response[] = $row['id_room'];
        }
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>