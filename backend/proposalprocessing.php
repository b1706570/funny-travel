<?php
    include 'default.php';
    $result=[];
    if($_POST['type']=="reject"){
        $sql="DELETE FROM `proposal` WHERE `id_proposal`=".$_POST['index'];
        if($connect->query($sql)){
            $result[]= array(
                "message" => "Successfully!",
                "code" => 200
            );
        }
        else{
            $result[]= array(
                "message" => "Server Error!",
                "code" => 500
            );
        }
    }
    else if($_POST['type']=="accept"){
        if($_POST['state'] == "new"){
            $password=md5($_POST['txtPassword']);
            $sql="INSERT INTO `host`(`fullname_host`, `company_name`, `email_host`, `password`, `phone_host`, `address_host`,`latitude`,`longtitude`) 
            VALUES ('".$_POST['txtFullname']."','".$_POST['txtHostname']."','".$_POST['txtGmail']."','".$password."',".$_POST['txtPhonenumber'].",'".$_POST['txtAddress']."',".$_POST['txtLat'].",".$_POST['txtLng'].")";
        }
        else{
            $result1=$connect->query("SELECT `password` FROM `host` WHERE `email_host`='".$_POST['txtGmail']."'");
            $r=$result1->fetch_assoc();
            $password=$r['password'];
            $sql="INSERT INTO `host`(`fullname_host`, `company_name`, `email_host`, `password`, `phone_host`, `address_host`,`latitude`,`longtitude`) 
            VALUES ('".$_POST['txtFullname']."','".$_POST['txtHostname']."','".$_POST['txtGmail']."','".$password."',".$_POST['txtPhonenumber'].",'".$_POST['txtAddress']."',".$_POST['txtLat'].",".$_POST['txtLng'].")";
        }
        $sql1="DELETE FROM `proposal` WHERE `id_proposal`=".$_POST['index'];
        if($connect->query($sql) && $connect->query($sql1)){
            $result[]= array(
                "message" => "Successfully!",
                "code" => 200
            );
            $to=$_POST['txtGmail'];
            $subject="Funny Travel Thông báo";
            $message="<h3>Chào bạn! Đây là Funny Travel.</h3></br>
            <p>Chúng tôi xin thông báo với bạn rằng doanh nghiệp của bạn đã được duyệt sử dụng hệ thống của chúng tôi.</p></br>
            <p>Bạn hãy đăng nhâp vào hệ thống và trải nghiệm dịch vụ nhé!</p></br>
            <p>Tên đăng nhập: ".$_POST['txtGmail']."<p></br>
            <p>Mật khẩu: ".$_POST['txtPassword']."<p></br>
            <p>Thân mến!</p>
            <p>Funny Travel.</p>";
            $header="From: funnytravel2102@gmail.com \r\n";
            $header.="Content-type: text/html; charset=utf-8 \r\n";
            mail($to,$subject,$message,$header);
        }
        else{
            $result[]= array(
                "message" => "Server Error!",
                "code" => 500
            );
        }
    }
    echo json_encode($result, JSON_PRETTY_PRINT);
    $connect->close();
?>