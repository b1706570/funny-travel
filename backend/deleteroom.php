<?php
    include 'default.php';
    $sql = "DELETE FROM `rooms` WHERE `id_room` = ".$_POST['id_room'];
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