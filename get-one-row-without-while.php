<?php

// Conexão
mysql_connect("HOST", "USUÁRIO", "SENHA");
mysql_select_db("BANCO");

// Query
$query = "SELECT * FROM tabela WHERE campo='$parametro'";
$query = mysql_query($query);

// Tirando o while
$dados = mysql_fetch_array($query);

// Exibição
echo $dados['qualquer_campo'];

?>
