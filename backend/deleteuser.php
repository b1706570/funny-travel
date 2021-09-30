<?php
    include 'default.php';
    if($_POST['type'] == "member") {
        $sql = "DELETE FROM `member` WHERE `id_mem`=".$_POST['id_member'];
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
    }
    else{
        $sql = "DELETE FROM `host` WHERE `id_host`=".$_POST['id_host'];
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
    }
    echo json_encode($result, JSON_PRETTY_PRINT);
    $connect->close();
?>