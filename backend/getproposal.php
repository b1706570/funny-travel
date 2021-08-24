<?php
    include 'default.php';
    if($_POST['type']=='length')
        $sql="select count(*) count from proposal";
    else
        $sql="select * from proposal";
    $result=$connect->query($sql);
    $res=[];
    while($row=$result->fetch_assoc()){
        $res[]=$row;
    }
    echo json_encode($res, JSON_PRETTY_PRINT);
    $connect->close();
?>