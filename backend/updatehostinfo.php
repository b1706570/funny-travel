<?php
    include 'default.php';
    $logourl="image/".$_FILES['txtLogo']['name'];
    if($_POST['txtPassword'] !== ''){
        $password=md5($_POST['txtPassword']);
        $connect->query("UPDATE `host` SET `password`='".$password."' WHERE `email_host`='".$_POST['txtGmail']."'");
        /*$sql="UPDATE `host` SET 
        `fullname_host`='".$_POST['txtFullname']."', 
        `company_name`='".$_POST['txtHostname']."', 
        `email_host`='".$_POST['txtGmail']."', 
        `password`='".$password."', 
        `paypal_id`='".$_POST['txtPaypal']."', 
        `bank_number`='".$_POST['txtBanknumber']."', 
        `branch_name`='".$_POST['txtBranchname']."', 
        `owner_acount`='".$_POST['txtOwneraccount']."', 
        `phone_host`=".$_POST['txtPhonenumber'].", 
        `address_host`='".$_POST['txtAddress']."', 
        `latitude`=".$_POST['lat'].", 
        `longtitude`=".$_POST['lng']."  
        WHERE `id_host`=".$_POST['txtID'];*/
    }
    $sql="UPDATE `host` SET 
    `fullname_host`='".$_POST['txtFullname']."', 
    `company_name`='".$_POST['txtHostname']."', 
    `email_host`='".$_POST['txtGmail']."', 
    `paypal_id`='".$_POST['txtPaypal']."', 
    `bank_number`='".$_POST['txtBanknumber']."', 
    `branch_name`='".$_POST['txtBranchname']."', 
    `owner_acount`='".$_POST['txtOwneraccount']."',
    `phone_host`=".$_POST['txtPhonenumber'].", 
    `address_host`='".$_POST['txtAddress']."', 
    `latitude`=".$_POST['lat'].", 
    `longtitude`=".$_POST['lng']."  
    WHERE `id_host`=".$_POST['txtID'];
    $result=[];
    if($connect->query($sql)){
        if($_FILES['txtLogo']['error'] == 0){
            $connect->query("UPDATE `host` SET `logo_host`='".$logourl."' WHERE `id_host`=".$_POST['txtID']);
            move_uploaded_file($_FILES['txtLogo']['tmp_name'],$logourl);
        }
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
    echo json_encode($result, JSON_PRETTY_PRINT);
    $connect->close();
?>