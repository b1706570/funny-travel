<?php
    include 'default.php';
    $checkin_date = $_POST['checkin']." 12:01:00";
    $checkout_date = $_POST['checkout']." 12:00:00";
    $result = $connect->query("SELECT `fullname`,`phone` FROM `member` WHERE `id_mem`=".$_POST['id_member']);
    $row = $result->fetch_assoc();
    $sql="INSERT INTO `booking_schedule`(`id_member`, `id_room`, `fullname`, `phone`, `checkin_date`, `checkout_date`, `deposit`, `state`)  
    VALUES (".$_POST['id_member'].", ".$_POST['id_room'].", '".$row['fullname']."', '".$row['phone']."', '".$checkin_date."', '".$checkout_date."', ".$_POST['deposit'].", 'CHOXACNHAN')";
    $response = [];
    if($connect->query($sql)){
        $response[] = array(
            "code" => 200,
            "message" => "Successfully!",
        );
    }
    else{
        $response[] = array(
            "code" => 500,
            "message" => "Server Error!",
        );
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>