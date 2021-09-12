<?php
    include 'default.php';
    $listconv = "";
    foreach($_POST['txtListConv'] as $item){
        $listconv = $listconv."".$item.";";
    }

    $listimg = "";
    if(isset($_POST['txtOldImage'])){
        foreach($_POST['txtOldImage'] as $img){
            $listimg = $listimg."".$img.";";
        }
    }

    if(isset($_FILES['txtImageroom'])){
        $num_files = count($_FILES['txtImageroom']['name']);
        for($i=0; $i<$num_files; $i++){
            $listimg = $listimg."imageRoom/".$_FILES['txtImageroom']['name'][$i].";";
        }
    }
    
    $sql = "UPDATE `rooms` SET `convenients_room` = '".$listconv."', 
                                `name_room` = '".$_POST['txtRoomname']."', 
                                `type_room` = ".$_POST['txtRoomtype'].", 
                                `capacity_room` = ".$_POST['txtCapacity'].", 
                                `price_room` = ".$_POST['txtRoomprice'].", 
                                `images_room` = '".$listimg."' WHERE `id_room` = ".$_POST['txtIDRoom'];
    $result=[];
    if($connect->query($sql)){
        if(isset($_FILES['txtImageroom'])){
            for($x=0; $x < $num_files; $x++){
                $tmp_file = $_FILES['txtImageroom']['tmp_name'][$x];
                $path_file = "imageRoom/".$_FILES['txtImageroom']['name'][$x];
                move_uploaded_file($tmp_file, $path_file);
            }
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