app.initialize();

//abre o banco agenda, do banco de dados Database, com 2000 registros
 var db = window.openDatabase("Database", "1.0", "Agenda", 2000);
db.transaction(createDB, errorDB, successDB);

//Quando o objeto documento "escuta" que está pronto executa a Função onDeviceReady
 document.addEventListener("deviceready", onDeviceReady, false);

 //cria tabela no banco de dados quando dispositivo esiver pronto
  function onDeviceReady(){
  	db.transaction(createDB, errorDB, successDB);

  }

  //trata erro de criação do banco de dados
  function errorDB(err){
  	alert("Erro: "+ err);

  }

  //Executa se criou o Banco de dados com sucesso
  function successDB(){}

  //Cria a tabela se a mesma não existir
   function createDB(tx){
   	tx.executeSql('CREATE TABLE IF NOT EXISTS Agenda(id INTEGER PRIMARY KEY, nome VARCHAR(50), tel NUM(15) )');
   }  


  //Prepara para incluir registro na tabela Agenda
   function agenda_insert(){
    	db.transaction(agenda_insert_bd, errorDB, successDB);
    }

  //Inclui registro na tabela Agenda
   function agenda_insert_bd(tx){
     
		  var nome = $("#agenda_nome").val();
     	var tel = $("#agenda_telefone").val();
        if(nome == ""){
          alert("Prencha o campo um nome");
          return false;
        }
        if(tel == ""){
          alert("Prencha o campo um telefone");
          return false;
        }
     
        if(nome != "" && tel !=""){
       	  tx.executeSql('INSERT INTO Agenda (nome, tel) VALUES ("' + nome + '", "' + tel + '")');
     	    agenda_view();
        }
     
  }

  //PREPARA PARA DELETAR REGISTRO DA TABELA AGENDA
   function agenda_delete(agenda_id){
     $("#agenda_id_delete").val(agenda_id);
     db.transaction(agenda_delete_db, errorDB, successDB);
   }
   
  //DELETA REGISTRO DA TABELA AGENDA E CHAMA A FUNÇÃO AGENDA_VIEW()
    function agenda_delete_db(tx){
     var agenda_id_delete = $("#agenda_id_delete").val();
     tx.executeSql("DELETE FROM Agenda WHERE id = "+ agenda_id_delete);
     agenda_view();
    }
    
  //PREPARA PARA LER OS REGISTROS DA TABELA AGENDA
   function agenda_view(){
   	db.transaction(agenda_view_db, errorDB, successDB);
   }

  //Monta a matriz com os registros da tabela Agenda
   function agenda_view_db(tx){
   	tx.executeSql('SELECT * FROM Agenda', [], agenda_view_data, errorDB);
   }

  //Mostra os registros da tabela Agenda na tag <tbody id ="agenda_listagem">
   function agenda_view_data(tx, results){
 	$("#agenda_listagem").empty();
 	var len = results.rows.length;

 	for(var i = 0; i < len; i++){
 		$("#agenda_listagem").append(
       "<tr class='agenda_item_lista'>"+
       "<td><h3>"+ results.rows.item(i).id +"</h3></td>"+
 	   "<td><h3>"+ results.rows.item(i).nome +"</h3></td>"+
       "<td><h3>"+ results.rows.item(i).tel +"</h3></td>"+
       "<td><input type='button' class = 'btn btn-lg btn-danger' value ='X' onclick='agenda_delete("+ results.rows.item(i).id + ")'></td>" +
       "<td><input type='button' class = 'btn btn-lg btn-warining' value ='E' onclick='agenda_update_abrir_tela("+ results.rows.item(i).id + ")'></td>" +
 	   "</tr>");
 	}  	
   }

   function agenda_update_abrir_tela(agenda_id) {
   $("#tela_padrao").hide(); //esconde tela inicial
   $("#tela_edicao").show(); //tela mostra tela de edicao

   var agenda_nome_updade = $("#agenda_item_" + agenda_id + " .agenda_info h3").html();
   var agenda_telefone_updade = $("#agenda_item_" + agenda_id + " .agenda_info h5").html();

   $("#agenda_id_update").val(agenda_id);
   $("#agenda_nome_update").val(agenda_nome_updade);
   $("#agenda_telefone_update").val(agenda_telefone_updade);
   }

   function agenda_update_fechar_tela () {
    $("#tela_edicao").hide(); //esconde tela de edicao
    $("#tela_padrao").show(); //tela mostra tela de edicao
   }

   function agenda_update () {
       db.transaction(agenda_update_db, errorDB, successDB);
   }

     //cria variável
    function agenda_update_db(tx) {
    var agenda_id_novo = $("#agenda_id_update").val();
    var agenda_nome_novo = $("#agenda_nome_update").val();
    var agenda_telefone_novo = $("#agenda_telefone_update").val();

    tx.executeSql('UPDATE agenda SET nome = "' + agenda_nome_novo + '", tel = "' + agenda_telefone_novo + '" WHERE id = "' + agenda_id_novo + '" ');

    agenda_update_fechar_tela();
    agenda_view();
   }