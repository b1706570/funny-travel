<?php
    include 'default.php';
    $iconURL="icon/".$_FILES['icon_conv']['name'];
    $result=[];
    $sql="INSERT INTO `convenient`(`name_conv`, `icon_conv`) VALUES ('".$_POST['name_conv']."','".$iconURL."')";
    if($connect->query($sql)){
        move_uploaded_file($_FILES['icon_conv']['tmp_name'],$iconURL);
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