<?php
    include 'default.php';
    $response = [];
    $result = $connect->query("SELECT * FROM `booking_schedule` WHERE `id_booking`=".$_POST['id_booking']);
    $row = $result->fetch_assoc();
    $sql = "DELETE FROM `booking_schedule` WHERE `id_booking`=".$_POST['id_booking'];
    $sql1 = "INSERT INTO `transaction`(`id_member`, `id_room`, `fullname`, `phone`, `checkin_date`, `checkout_date`, `deposit`, `total_payment`, `state`) 
    VALUES (".$row['id_member'].", ".$row['id_room'].", '".$row['fullname']."', '".$row['phone']."', '".$row['checkin_date']."', '".$row['checkout_date']."', ".$row['deposit'].",0 , 'DAHUY')";
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