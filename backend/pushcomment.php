<?php
    include 'default.php';
    $res=[];
    $ok = false;
    if(isset($_FILES['image']) || isset($_POST['content'])){
        if(isset($_FILES['image'])){
            $imgURL="imageComment/".$_FILES['image']['name'];
            $valueImg = $imgURL;
            move_uploaded_file($_FILES['image']['tmp_name'],$imgURL);
        }
        else{
            $valueImg = "";
        }
        if(isset($_POST['content'])){
            $valueContent = $_POST['content'];
        }
        else{
            $valueContent = "";
        }
        $sql = "INSERT INTO `comment`(`id_member`, `id_host`, `content`, `image`) 
        VALUES (".$_POST['id_member'].", ".$_POST['id_host'].", '".$valueContent."', '".$valueImg."')";
        if($connect->query($sql)){
            $ok = true;
        }
    }
    if(isset($_POST['evaluate'])){
        $result=$connect->query("SELECT * FROM `evaluate` WHERE `id_host`=".$_POST['id_host']." AND `id_member`=".$_POST['id_member']);
        if($result->num_rows == 0 )
            $sql1 = "INSERT INTO `evaluate`(`id_member`, `id_host`, `point`) VALUES (".$_POST['id_member'].", ".$_POST['id_host'].", ".$_POST['evaluate'].")";
        else
            $sql1="UPDATE `evaluate` SET `point`=".$_POST['evaluate']." WHERE `id_host`=".$_POST['id_host']." AND `id_member`=".$_POST['id_member'];
        if($connect->query($sql1)){
            $ok = true;
        }
    }
    if($ok == true){
        $res[] = array(
            "code" => 200,
            "message" => "Successfully!",
        );
    }
    else{
        $res[] = array(
            "code" => 500,
            "message" => "Server Error!",
        );
    }
    echo json_encode($res, JSON_PRETTY_PRINT);
    $connect->close();
?>