<?php
    include 'default.php';
    $response = [];
    $sql="DELETE FROM `comment` WHERE `id_comment`=".$_POST['id_comment'];
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