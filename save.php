<?php 
include("Database.class.php");
$db = new Database("root", "dirgh2002", "form_builder");
$_POST  = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);
$encoded = json_encode($_POST);
if($db)
	$db->insert($encoded);
echo $encoded;exit();