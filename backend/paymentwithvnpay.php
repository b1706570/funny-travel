<?php
    include 'default.php';
    $response = [];
    // INSERT tam vao db khi cho thanh toan bang vnpay
    if(isset($_POST['insert'])){
        $checkin_date = $_POST['checkin']." 12:01:00";
        $checkout_date = $_POST['checkout']." 12:00:00";
        $result1 = $connect->query("SELECT `id_room` FROM `rooms` WHERE `type_room` = ".$_POST['type_room']." AND `id_host`= ".$_POST['id_host']." AND `id_room` NOT IN (SELECT `id_room` FROM `booking_schedule` WHERE `checkin_date` BETWEEN '".$checkin_date."' AND '".$checkout_date."' OR '".$checkin_date."' BETWEEN `checkin_date` AND `checkout_date`)");
        $row1 = $result1->fetch_assoc();
        $result2 = $connect->query("SELECT * FROM `member` WHERE `id_mem` = ".$_POST['id_member']);
        $row2 = $result2->fetch_assoc();
        $sql = "INSERT INTO `booking_schedule`(`id_member`, `id_host`, `id_room`, `type_room`, `fullname`, `phone`, `checkin_date`, `checkout_date`, `deposit`, `code`)  
        VALUES (".$_POST['id_member'].", ".$_POST['id_host']." ,".$row1['id_room']." ,".$_POST['type_room'].", '".$row2['fullname']."', '".$row2['phone']."', '".$checkin_date."', '".$checkout_date."', ".$_POST['deposit'].", '".$_POST['code']."')";
        if($connect->query($sql)){
            $result = $connect->query("SELECT * FROM `booking_schedule` WHERE `id_member` = ".$_POST['id_member']." AND `id_room` = ".$row1['id_room']." AND `checkin_date` = '".$checkin_date."' && `checkout_date` = '".$checkout_date."'");
            $row = $result->fetch_assoc();
            $response['id_booking'] = $row['id_booking'];
        }
        echo json_encode($response, JSON_PRETTY_PRINT);
    }
    // Kiem tra xem don hang da that su duoc duyet hay chua
    else if(isset($_POST['check'])){
        $sql = "SELECT * FROM `booking_schedule` WHERE `id_booking` = ".$_POST['id_booking']." AND `state`='DAXACNHAN'";
        $result = $connect->query($sql);
        if($result->num_rows > 0){
            $response[]= array(
                "message" => "Successfully!",
                "code" => 200
            );
        }
        else{
            $connect->query("DELETE FROM `booking_schedule` WHERE `id_booking`=".$_POST['id_booking']." AND `state`=''");
            $response[]= array(
                "message" => "Server Error!",
                "code" => 500,
                "a" => $_POST['id_booking']
            );
        }
        echo json_encode($response, JSON_PRETTY_PRINT);
    }
    // Xac thuc da thanh toan VNPay
    else{
        if($_GET['vnp_ResponseCode'] == 00){
            $connect->query("UPDATE `booking_schedule` SET `state`='DAXACNHAN' WHERE `id_booking`=".$_GET['vnp_TxnRef']);
            echo "Thanh toán thành công!";
        }
        else{
            $sql = "DELETE FROM `booking_schedule` WHERE `id_booking`=".$_GET['vnp_TxnRef'];
            $connect->query($sql);
            echo "Thanh toán thất bại! Xin thử lại";
        }
    }
    $connect->close();
?>