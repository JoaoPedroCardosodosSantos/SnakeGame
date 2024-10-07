<?php

$host = 'localhost';
$dbname = 'JogoCobrinha';
$username = 'root';
$password = 'Mysql12@root';

$status = $_GET['status'];
$score = $_GET['score'];
$name = $_GET['name'];

$users = $_GET['users'];

if($status === '?') {

    try {

        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $mysql = 'runing';
        $dbconection = true;

        $sql = "SELECT MAX(Score) AS max_score FROM Users";
        $prepare = $pdo->prepare($sql);

        $prepare->execute();

        $hiscore = $prepare->fetch(PDO::FETCH_ASSOC);

        $response = Array(

            'server status' => 200,
            'mysql status' => $mysql,
            'connected to database' => $dbconection,
            'hiscore' => (int)$hiscore['max_score'],
            'message' => "It's OK!",

        );

        header('Content-Type: application/json');

        echo json_encode($response);

    } catch(PDOException $e) {
        $mysql = 'Error: ' . $e->getMessage();

        echo $mysql;


    }


} elseif(isset($score) && isset($name)) {

    $score = (int)$score;

    if (is_int($score)) {
    
        try {
    
            $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
            $mysql = 'runing';
            $dbconection = true;
    
            $sql = "INSERT INTO Users (User, Score) VALUES (:user, :score)";
            $prepare = $pdo->prepare($sql);
            $prepare->bindParam(':user', $name);
            $prepare->bindParam(':score', $score);
    
            $prepare->execute();
    
            $hiscore = $prepare->fetch(PDO::FETCH_ASSOC);
    
            $response = Array(
    
                'server status' => 200,
                'mysql status' => $mysql,
                'connected to database' => $dbconection,
                'message' => 'Valores adicionados com sucesso !',
    
            );
    
            header('Content-Type: application/json');
    
            echo json_encode($response);
    
        } catch(PDOException $e) {
            $mysql = 'Error: ' . $e->getMessage();
            $dbconection = false;
    
            $response = Array(
    
                'server status' => 200,
                'mysql status' => $mysql,
                'connected to database' => $dbconection,
                'message' => 'Erro ao adicionar os valores',
    
            );
    
            header('Content-Type: application/json');
    
            echo json_encode($response);
    
        }
    
    } 
    
} elseif($users === '?') {

    try {

        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT * FROM Users ORDER BY Score DESC";
        $prepare = $pdo->prepare($sql);

        $prepare->execute();

        $table = $prepare->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');

        echo json_encode($table);
    } catch(PDOException $e) {

        $mysql = 'Error: ' . $e->getMessage();
        $dbconection = false;

        $response = Array(

            'server status' => 200,
            'mysql status' => $mysql,
            'connected to database' => $dbconection,
            'message' => 'Erro ao adicionar os valores',

        );

        header('Content-Type: application/json');

        echo json_encode($response);
    }   


} else {

    $response = Array(

        'server status' => 200,
        'message' => 'Requisição invalida !',

    );

    header('Content-Type: application/json');

    echo json_encode($response);
}



?>
