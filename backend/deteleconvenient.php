<?php
    include 'default.php';
    $sql="DELETE FROM `convenient` WHERE `id_conv`=".$_POST['index'];
    $result=[];
    if($connect->query($sql)){
        $result[] = array(
            "message" => "Successfully!",
            "code" => 200
        );
    }
    else{
        $result[] = array(
            "message" => "Server Error!",
            "code" => 500
        );
    }
    echo json_encode($result, JSON_PRETTY_PRINT);
    $connect->close();
?>