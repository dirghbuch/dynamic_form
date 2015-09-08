<?php 

class Database {
	private $pdo;
	private $parameters;
	/**
	 * Connecting database
	 */
	public function __construct($username, $password, $database) { 			
		try{
			$this->pdo = new PDO('mysql:host=localhost;dbname='.$database, $username, $password);
		} catch( Exception $e){
			print_r($e);
			die("Cannot connect to database with given parameters");
		}
	}



	/**
	* Insert form data
	*/
	public function insert($formData){
		$sql = "INSERT INTO custom_data(form_data) 
		VALUES (
            :formData)";      
		$query = $this->pdo->prepare($sql);
		                                              
		$query->bindParam(':formData', $formData, PDO::PARAM_STR);       
		$query->execute();
	}
}