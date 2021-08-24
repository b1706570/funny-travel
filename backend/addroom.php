<?php
    include 'default.php';
    $listconv = "";
    foreach($_POST['txtListConvenient'] as $item){
        $listconv = $listconv."".$item.";";
    }
    $listimg = "";
    $num_files = count($_FILES['txtImageroom']['name']);
    for($i=0; $i<$num_files; $i++){
        $listimg = $listimg."imageRoom/".$_FILES['txtImageroom']['name'][$i].";";
    }
    $sql="INSERT INTO `rooms`(`id_host`, `convenients_room`, `name_room`, `type_room`, `capacity_room`, `price_room`, `images_room`) 
    VALUES (".$_POST['IDhost'].",'".$listconv."','".$_POST['txtRoomname']."',".$_POST['txtRoomtype'].",".$_POST['txtCapacity'].",".$_POST['txtNPrice'].",'".$listimg."')";
    $result=[];
    if($connect->query($sql)){
        for($i=0; $i<$num_files; $i++){
            $tmp_file = $_FILES['txtImageroom']['tmp_name'][$i];
            $path_file = "imageRoom/".$_FILES['txtImageroom']['name'][$i];
            move_uploaded_file($tmp_file, $path_file);
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