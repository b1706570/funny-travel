<?php
    include 'default.php';
    $sql="UPDATE `convenient` SET `name_conv`='".$_POST['name_conv']."' WHERE `id_conv`=".$_POST['id_conv'];
    $result=[];
    if($connect->query($sql)){
        if($_FILES['icon_conv']['error'] == 0){
            $iconURL = "icon/".$_FILES['icon_conv']['name'];
            $connect->query("UPDATE `convenient` SET `icon_conv`='".$iconURL."' WHERE `id_conv`=".$_POST['id_conv']);
            move_uploaded_file($_FILES['icon_conv']['tmp_name'],$iconURL);
        }
        $result[] = array(
            "message" => "Successfully!",
            "code" => 200
        );
    }
    else{
        $result[]= array(
            "message" => "Server Error!",
            "code" => 500
        );
    }
    echo json_encode($result, JSON_PRETTY_PRINT);
    $connect->close();
?>