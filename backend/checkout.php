<?php
    include 'default.php';
    $sql = "INSERT INTO `transaction`(`id_member`, `id_room`, `fullname`, `phone`, `checkin_date`, `checkout_date`, `deposit`, `total_payment`, `state`) 
            VALUES (".$_POST['id_member'].", ".$_POST['id_room'].", '".$_POST['fullname']."', '".$_POST['phone']."', '".$_POST['checkin_date']."', '".$_POST['checkout_date']."', ".$_POST['deposit'].", ".$_POST['total_payment'].", 'DATHANHTOAN')";
    $sql1 = "DELETE FROM `booking_schedule` WHERE `id_booking`=".$_POST['id_booking'];
    $response = [];
    if($connect->query($sql) && $connect->query($sql1)){
        $response[] = array(
            "code" => 200,
            "message" => "Successfully!"
        );
    }
    else{
        $response[] = array(
            "code" => 500,
            "message" => "Server Error"
        );
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>