<?php
    include 'default.php';
    $checkin = $_POST['checkin']." 12:01:00";
    $checkout = $_POST['checkout']." 12:00:00";
    $sql="SELECT `id_room` FROM `booking_schedule` WHERE ('".$checkin."' BETWEEN `checkin_date` AND `checkout_date`) 
    OR ('".$checkout."' BETWEEN `checkin_date` AND `checkout_date`) 
    OR (`checkin_date` BETWEEN '".$checkin."' AND '".$checkout."') 
    OR (`checkout_date` BETWEEN '".$checkin."' AND '".$checkout."')";
    $response = [];
    $result=$connect->query($sql);
    while ($row=$result->fetch_assoc()) {
        $response[] = $row['id_room'];
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>