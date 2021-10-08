<?php
    include 'default.php';
    $response = [];
    $result = $connect->query("SELECT * FROM `member` WHERE `id_mem`=".$_POST['id']);
    if($result->num_rows === 0){
        $sql = "INSERT INTO `member`(`id_mem`, `username`, `password`, `fullname`, `phone`, `address`, `latitude`, `longtitude`) VALUES 
        (".$_POST['id'].", '', '', '".$_POST['fullname']."', '', '', 0, 0)";
        $connect->query($sql);
        $response[] = 1;
    }
    else{
        $response[] = 0;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>