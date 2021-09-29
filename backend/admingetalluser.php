<?php
    include 'default.php';
    $response = [];
    $res = [];
    $start = $_POST['pagination'] * 100;
    $end = 100;
    $sql = "SELECT * FROM `member` WHERE `fullname` LIKE '%".$_POST['search']."%' LIMIT ".$start.", ".$end;
    $result = $connect->query($sql);
    while ($row = $result->fetch_assoc()) {
        if($row['id_mem'] == 0 || $row['id_mem'] == 1)
            continue;
        $res[] = $row;
    }
    $response['data'] = $res;
    $result1 = $connect->query("SELECT * FROM `member` WHERE `fullname` LIKE '%".$_POST['search']."%' LIMIT ".($start + 101).", 1");
    if($result1->num_rows > 0)
        $response['more'] = 1;
    else
        $response['more'] = 0;
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>