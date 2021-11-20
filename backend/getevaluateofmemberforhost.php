<?php
    include 'default.php';
    $response = [];
    $sql = "SELECT `point` FROM `evaluate` WHERE `id_member`=".$_POST['id_member']." and `id_host`=".$_POST['id_host'];
    $result = $connect->query($sql);
    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $response[] = array(
            "evaluate" => $row['point'],
        );
    }
    else{
        $response[] = array(
            "evaluate" => -1,
        );
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close()
?>