<?php
    include 'default.php';
    $sql="SELECT e.`point`, c.`content`, c.`image`, c.`date_create`, m.`fullname` FROM `evaluate` e LEFT JOIN `comment` c ON e.`id_member`=c.`id_member` AND e.`id_host`=c.`id_host` JOIN `member` m ON m.`id_mem`=e.`id_member` 
    WHERE e.`id_host`=".$_POST['id']." UNION 
    SELECT e.`point`, c.`content`, c.`image`, c.`date_create`, m.`fullname` FROM `evaluate` e RIGHT JOIN `comment` c ON e.`id_member`=c.`id_member` AND e.`id_host`=c.`id_host` JOIN `member` m ON m.`id_mem`=c.`id_member` 
    WHERE c.`id_host`=".$_POST['id'];
    $response=[];
    $result=$connect->query($sql);
    while($row=$result->fetch_assoc()){
        $response[]=$row;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>