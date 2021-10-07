<?php
    include 'default.php';
    $checkin_date = $_POST['checkin']." 12:01:00";
    $checkout_date = $_POST['checkout']." 12:00:00";
    $result = $connect->query("SELECT `fullname`,`phone` FROM `member` WHERE `id_mem`=".$_POST['id_member']);
    $row = $result->fetch_assoc();
    if($_POST['paypal'] == 0){
        $sql="INSERT INTO `booking_schedule`(`id_member`, `id_host`, `type_room`, `fullname`, `phone`, `checkin_date`, `checkout_date`, `deposit`, `state`)  
        VALUES (".$_POST['id_member'].", ".$_POST['id_host']." ,".$_POST['type_room'].", '".$row['fullname']."', '".$row['phone']."', '".$checkin_date."', '".$checkout_date."', ".$_POST['deposit'].", 'CHOXACNHAN')";
    }
    else{
        $result1 = $connect->query("SELECT `id_room` FROM `rooms` WHERE `type_room` = ".$_POST['type_room']." && `id_host`= ".$_POST['id_host']);
        $row1 = $result1->fetch_assoc();
        $sql = "INSERT INTO `booking_schedule`(`id_member`, `id_host`, `id_room`, `type_room`, `fullname`, `phone`, `checkin_date`, `checkout_date`, `deposit`, `code`, `state`)  
        VALUES (".$_POST['id_member'].", ".$_POST['id_host']." ,".$row1['id_room']." ,".$_POST['type_room'].", '".$row['fullname']."', '".$row['phone']."', '".$checkin_date."', '".$checkout_date."', ".$_POST['deposit'].", '".$_POST['code']."' ,'DAXACNHAN')";
    }
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
            "message" => $sql,
        );
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>