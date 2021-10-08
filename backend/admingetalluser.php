<?php
    include 'default.php';
    $response = [];
    $res = [];
    if($_POST['type'] == "member"){
        $start = $_POST['pagination'] * 100;
        $end = 100;
        $sql = "SELECT * FROM `member` WHERE `fullname` LIKE '%".$_POST['search']."%' OR `phone` LIKE '%".$_POST['search']."%'  LIMIT ".$start.", ".$end;
        $result = $connect->query($sql);
        while ($row = $result->fetch_assoc()) {
            if($row['id_mem'] == 0 || $row['id_mem'] == 1)
                continue;
            $res[] = $row;
        }
        $response['data'] = $res;
        $result1 = $connect->query("SELECT * FROM `member` WHERE `fullname` LIKE '%".$_POST['search']."%' OR `phone` LIKE '%".$_POST['search']."%' LIMIT ".($start + 101).", 1");
        if($result1->num_rows > 0)
            $response['more'] = 1;
        else
            $response['more'] = 0;
        $result2 = $connect->query("SELECT COUNT(*) co FROM `member` WHERE `fullname` LIKE '%".$_POST['search']."%' OR `phone` LIKE '%".$_POST['search']."%'");
        if($result2->num_rows > 0){
            $row2 = $result2->fetch_assoc();
            if($row2['co'] % 100 === 0){
                $response['allpage'] = ROUND($row2['co'] / 100, 0);
            }
            else{
                $response['allpage'] = ROUND($row2['co'] / 100, 0) + 1;
            }
        }
        else{
            $response['allpage'] = 0;
        }
    }
    else{
        $start = $_POST['pagination'] * 30;
        $end = 30;
        $sql = "SELECT * FROM `host` WHERE `company_name` LIKE '%".$_POST['search']."%' OR `phone_host` LIKE '%".$_POST['search']."%'  LIMIT ".$start.", ".$end;
        $result = $connect->query($sql);
        while ($row = $result->fetch_assoc()) {
            $res[] = $row;
        }
        $response['data'] = $res;
        $result1 = $connect->query("SELECT * FROM `host` WHERE `company_name` LIKE '%".$_POST['search']."%' OR `phone_host` LIKE '%".$_POST['search']."%' LIMIT ".($start + 31).", 1");
        if($result1->num_rows > 0)
            $response['more'] = 1;
        else
            $response['more'] = 0;
        $result2 = $connect->query("SELECT COUNT(*) co FROM `host` WHERE `company_name` LIKE '%".$_POST['search']."%' OR `phone_host` LIKE '%".$_POST['search']."%'");
        if($result2->num_rows > 0){
            $row2 = $result2->fetch_assoc();
            if($row2['co'] % 30 === 0){
                $response['allpage'] = ROUND($row2['co'] / 30, 0);
            }
            else{
                $response['allpage'] = ROUND($row2['co'] / 30, 0) + 1;
            }
        }
        else{
            $response['allpage'] = 0;
        }
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>