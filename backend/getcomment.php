<?php
    include 'default.php';
    $response=[];
    if(isset($_POST['id'])){
        $sql="(SELECT e.`point`, c.`id_comment`, c.`content`, c.`image`, c.`date_create`, m.`fullname` FROM `evaluate` e LEFT JOIN `comment` c ON e.`id_member`=c.`id_member` AND e.`id_host`=c.`id_host` JOIN `member` m ON m.`id_mem`=e.`id_member` 
        WHERE e.`id_host`=".$_POST['id'].") UNION 
        (SELECT e.`point`, c.`id_comment`, c.`content`, c.`image`, c.`date_create`, m.`fullname` FROM `evaluate` e RIGHT JOIN `comment` c ON e.`id_member`=c.`id_member` AND e.`id_host`=c.`id_host` JOIN `member` m ON m.`id_mem`=c.`id_member` 
        WHERE c.`id_host`=".$_POST['id'].") ORDER BY `date_create` DESC";
        $result=$connect->query($sql);
        while($row=$result->fetch_assoc()){
            $response[]=$row;
        }
    }
    else{
        $data = [];
        $total_comment = 0;
        $start = ($_POST['pagination'] - 1) * 10;
        $sql = "SELECT c.*, m.`fullname`, h.`company_name` FROM `comment` c JOIN `member` m ON c.`id_member`=m.`id_mem` JOIN `host` h ON c.`id_host`=h.`id_host` LIMIT $start, 10";
        $result = $connect->query($sql);
        while ($row=$result->fetch_assoc()) {
            $result1=$connect->query("SELECT COUNT(*) count FROM `report` WHERE `id_comment`=".$row['id_comment']);
            $row1=$result1->fetch_assoc();
            $row['report'] = $row1['count'];
            $data[] = $row;
        }
        $response['data'] = $data;
        $result2=$connect->query("SELECT COUNT(*) count FROM `comment`");
        $row2=$result2->fetch_assoc();
        if($row2['count'] % 10 === 0){
            $response['total'] = $row2['count'] / 10;
        }
        else{
            $response['total'] = ROUND($row2['count'] / 10, 0) + 1;
        }
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>