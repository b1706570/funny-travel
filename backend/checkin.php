<?php
    include 'default.php';
    $response = [];
    if($_POST['prebook'] == true){
        if($_POST['otpcode'] != ""){
            $result = $connect->query("SELECT `code` FROM `booking_schedule` WHERE `id_booking` = ".$_POST['id_book']);
            $row = $result->fetch_assoc();
            if($_POST['otpcode'] == $row['code']){
                $connect->query("UPDATE `booking_schedule` SET `state`='DANHANPHONG' WHERE `id_booking`=".$_POST['id_book']);
                $response[] = array(
                    "code" => 1,
                    "message" => "Correct"
                );
            }
            else{
                $response[] = array(
                    "code" => 0,
                    "message" => "Incorrect"
                );
            }
        }
        else{
            $result = $connect->query("SELECT `fullname`,`phone` FROM `member` WHERE `id_mem` IN (SELECT `id_member` FROM `booking_schedule` WHERE `id_booking` = ".$_POST['id_book'].")");
            $row = $result->fetch_assoc();
            if(strcasecmp($_POST['fullname'], $row['fullname']) == 0 && $_POST['phone'] == $row['phone']){
                $connect->query("UPDATE `booking_schedule` SET `state`='DANHANPHONG' WHERE `id_booking`=".$_POST['id_book']);
                $response[] = array(
                    "code" => 1,
                    "message" => "Correct"
                );
            }
            else{
                $response[] = array(
                    "code" => 0,
                    "message" => "Incorrect"
                );
            }
        }
    }
    //else{}
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>