<?php
    include 'default.php';
    if(isset($_POST['id_room'])){
        $sql="SELECT `name_room`, `type_room`, `capacity_room`, `price_room` FROM `rooms` WHERE `id_room`=".$_POST['id_room'];
        $result=$connect->query($sql);
        $row=$result->fetch_assoc();
        $response[] = $row;
    }
    else{
        $sqlCondition="SELECT DISTINCT h.`id_host` FROM `host` h JOIN `rooms` r ON h.`id_host`=r.`id_host` WHERE 1";
        if(isset($_POST['price'])){
            $sqlCondition .= " AND r.`price_room` <= ".$_POST['price'];
        }
        if(isset($_POST['type_room'])){
            $sqlCondition .= " AND r.`type_room` = ".$_POST['type_room'];
        }
        if(isset($_POST['location'])){
            $sqlCondition .= " AND h.`address_host` LIKE '%".$_POST['location']."%'";
        }
        $startID = $_POST['start'] * 25 - 25;
        /* co dieu kien thi them vao sau 2 cho */
        $sql="SELECT * FROM `host` WHERE `id_host` IN (".$sqlCondition.") LIMIT ".$startID.",25";
        $result=$connect->query($sql);
        $response = [];
        while($row=$result->fetch_assoc()){
            $images_room = "";
            $convs_room = "";
            $price = 0;
            $total = 0;
            $sql1="SELECT r.`images_room`, r.`price_room`, r.`convenients_room` FROM `host` h JOIN `rooms` r ON h.`id_host`=r.`id_host` WHERE h.`id_host`=".$row['id_host'];
            $result1=$connect->query($sql1);
            while($row1=$result1->fetch_assoc()){
                $images_room = $images_room."".$row1['images_room'];
                $convs_room = $convs_room."".$row1['convenients_room'];
                $price = $price + $row1['price_room'];
                $total = $total + 1;
            }
            $result2=$connect->query("SELECT ROUND(AVG(`point`),1) avg FROM `evaluate` WHERE `id_host`=".$row['id_host']);
            $row2=$result2->fetch_assoc();
            if($row2['avg'] == NULL)
                $row['point'] = "Chưa có đánh giá";
            else
                $row['point'] = $row2['avg'];
            $row['price'] = round($price / $total, -4);
            $row['images'] = $images_room;
            $row['convenients'] = $convs_room; 
            $response[]=$row;
        }
        /* co dieu kien thi them vao sau 2 cho */
        $result2=$connect->query("SELECT COUNT(*) num_host FROM `host` WHERE `id_host` IN (".$sqlCondition.")");
        $row2=$result2->fetch_assoc();
        $response[] = $row2['num_host'];
    }
    echo json_encode($response,JSON_PRETTY_PRINT);
    $connect->close();
?>