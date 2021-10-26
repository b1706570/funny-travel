<?php
    include 'default.php';
    $sql="DELETE FROM `convenient` WHERE `id_conv`=".$_POST['index'];
    $result=[];
    if($connect->query($sql)){
        $sql1 = "SELECT * FROM `rooms`";
        $result1 = $connect->query($sql1);
        while($row1 = $result1->fetch_assoc()){
            $conv = explode(";",$row1['convenients_room']);
            foreach (array_keys($conv, $_POST['index']) as $key) {
                unset($conv[$key]);
            }
            $newconv = implode(";", $conv);
            $connect->query("UPDATE `rooms` SET `convenients_room` = '".$newconv."' WHERE `id_room` = ".$row1['id_room']);
        }
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