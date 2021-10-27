<?php
    include 'default.php';
    $response = [];
    $sql = "SELECT h.`id_host`, h.`company_name`, h.`address_host`, h.`latitude`, h.`longtitude`, ROUND(AVG(e.`point`), 1) point FROM `host` h JOIN `evaluate` e ON h.`id_host` = e.`id_host` WHERE `address_host` LIKE '%".$_POST['city']."%' OR `address_host` LIKE '%".$_POST['ward']."%' GROUP BY h.`id_host`";
    $result = $connect->query($sql);
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $images = "";
            $conv = "";
            $min_price = 99999999;
            $result1 = $connect->query("SELECT * FROM `rooms` WHERE `id_host` = ".$row['id_host']);
            while($row1 = $result1->fetch_assoc()){
                if($row1['price_room'] < $min_price){
                    $min_price = $row1['price_room'];
                }
                $conv .= $row1['convenients_room'];
                $images .= $row1['images_room'];
            }
            $row['convenients'] = $conv;
            $row['images'] = $images;
            $row['price'] = $min_price;
            $response[] = $row;
        }
    }
    else{
        $response[] = 'empty';
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    $connect->close();
?>