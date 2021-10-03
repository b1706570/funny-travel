<?php
    include 'default.php';
    $sql = "INSERT INTO `report` (`id_comment`, `id_reporter`, `reason`) VALUES (".$_POST['id_comment'].", ".$_POST['id_reporter'].", '".$_POST['reason']."')";
    $reponse = [];
    if($connect->query($sql)){
        $response[] = array(
            "message" => "Successfully!",
            "code" => 200
        );
    }
    else{
        $response[]= array(
            "message" => "Server Error!",
            "code" => 500
        );
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>