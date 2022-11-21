
function resolver(numVar,numRes,choice){
	$("#inputValues").hide();

	var matrizSimplex = getRestrictionValues(numVar,numRes); 
	matrizSimplex.push(getFunctionzValues(numVar,numRes)); 


	var tabela = [];

	var tablesCount = 0;

	var parar = 0;

	var bValues = []

	
	staticTblVars = staticTableVars(numVar,numRes);
	
	varsOnBase = staticTblVars[0];

	varsOnHead = staticTblVars[1];


	colunaCount = numVar + numRes + 1;
	linhaCount    = numRes + 1 ;

	for(let i = 0 ; i < linhaCount; i++){
		bValues.push(matrizSimplex[i][colunaCount-1])
	}

    
	matrizToTable(matrizSimplex,"Inicial",varsOnHead,varsOnBase,linhaCount,tabela,0);
	tablesCount++

	
	do{

		lowerNumberAndColumn = getLowerNumberAndColumn(matrizSimplex, linhaCount, colunaCount);
		lowerNumber = lowerNumberAndColumn[0];


		if(lowerNumber == 0){
			break;
		}
		columnLowerNumber = lowerNumberAndColumn[1];

		
		whoLeavesResults = whoLeavesBase(matrizSimplex, columnLowerNumber, colunaCount, linhaCount, varsOnBase);
		varsOnBase = whoLeavesResults[1];
		pivoLinha    = whoLeavesResults[0]
		pivoColuna = columnLowerNumber;
		pivoValue  = matrizSimplex[pivoLinha][pivoColuna];


	
		matrizSimplex = divPivoRow(matrizSimplex,colunaCount,pivoLinha,pivoValue);

		
		matrizSimplex = nullColumnElements(matrizSimplex,pivoLinha,pivoColuna,linhaCount,colunaCount);
		
		
		funczValues = matrizSimplex[linhaCount-1];
		
		hasNegativeOrPositive = funczValues.some(v => v < 0);
	
		

		 
		if(hasNegativeOrPositive == true){
			matrizToTable(matrizSimplex,"Parcial"+parar,varsOnHead,varsOnBase,linhaCount,tabela,tablesCount);
			tablesCount++
		}

	}while(hasNegativeOrPositive == true);


	matrizToTable(matrizSimplex,"Final",varsOnHead,varsOnBase,linhaCount,tabela,tablesCount);
	if(choice == 1){
		$(".container").append(tabela[parar]);
		printResults(matrizSimplex,numVar,numRes,colunaCount,varsOnBase);
	}else{
		for (let i = 0 ; i < tabela.length; i++) {
			$(".container").append(tabela[i]);
		}	
		printResults(matrizSimplex,numVar,numRes,colunaCount,varsOnBase);
	}

	$(".container").append('<br><div class="row"><div class="col-md-12"><button id="again" class="btn btn-primary" onclick="location.reload();" >Recomeçar</button></div>	</div>')
	
}	



function matrizToTable(matriz, divName, head, base, linhaCount, tabela, aux){
	$("#auxDiv").html('<div class="row"><div id="divTable'+divName+'" class="offset-md-2 col-md-8 offset-md-2 table-responsive"><div class="row"><h3>Tabela '+divName+':</h3></div><table id="table'+divName+'" class="table table-bordered"></table></div></div>')
	var table = $("#table"+divName);
	var row, cell;

	
	var matrizTable = [];
	var headTable   = [];
	var baseTable   = [];

	for (let i = 0; i < matriz.length; i++){
    	matrizTable[i] = matriz[i].slice();
	}

	for (let i = 0; i < head.length; i++){
    	headTable[i] = head[i].slice();
	}

	for (let i = 0; i < base.length; i++){
    	baseTable[i] = base[i].slice();
	}


	$("#resolver").remove();
	$("#stepByStep	").remove();

	
	matrizTable.unshift(headTable);
	
	for (let i = 1, j=0; i <= linhaCount; i++, j++){
		matrizTable[i].unshift(baseTable[j]);
	} 

	
	for(let i=0; i<matrizTable.length; i++){
		row = $( '<tr />' );
		table.append( row );
		for(let j=0; j<matrizTable[i].length; j++){
			if(!isNaN(matrizTable[i][j])){
				cell = $('<td>'+ (Math.round(matrizTable[i][j]*100)/100 ) +'</td>')
			}else{
				cell = $('<td>'+matrizTable[i][j]+'</td>')
			}
			
			row.append( cell );
		}
	}
	
	tabela[aux] = $('#divTable'+divName+'')[0].outerHTML ;
}


function printResults(matriz,numVar,numRes,colunaCount,base){

	

	if(($("#min").is(':checked'))){
		var zValue = matriz[matriz.length-1][colunaCount-1] * -1;
		
	}else{
		var zValue = matriz[matriz.length-1][colunaCount-1]
	}

	$("#solution").append('<div class="col-md-12">A solução ótima é Z = '+zValue+'</div><br>');

	
	for (let i = 0; i < numRes ; i++) {
		var baseName = base[i];
		var baseValue = matriz[i][colunaCount-1];
		$("#results").append('<div>'+baseName+'='+baseValue+'</div>')
	}

}


function staticTableVars(numVar,numRes){
	base = [];
	head = [];

	
	for (let i = 0; i < numRes ; i++) {
		base.push("xf"+(i+1));
	}
	base.push("Z");


	head.push("Base");
	
	for (let i = 0; i < numVar ; i++) {
		head.push("x"+(i+1));
	}
	for (let i = 0; i < numRes ; i++) {
		head.push("xf"+(i+1));
	}
	head.push("b");
	
	return [base, head];
}

function nullColumnElements(matriz, pivoLinha, pivoColuna,linhaCount, colunaCount){

	for (let i = 0; i < linhaCount; i++) {

		
		if(i==pivoLinha || matriz[i][pivoColuna] == 0 ){
			continue;
		}
		
		pivoAux = matriz[i][pivoColuna];

		
		for (let j = 0; j < colunaCount; j++) {
			
			matriz[i][j] = (matriz[pivoLinha][j] * (pivoAux * -1)) + matriz[i][j] ;

		}
		
	}
	return matriz
}



function divPivoRow(matriz, colunaCount , pivoLinha, pivoValue){
	for (var i = 0; i < colunaCount; i++) {
		matriz[pivoLinha][i]  = matriz[pivoLinha][i] / pivoValue;
	}

	return matriz;
}


function whoLeavesBase(matriz, columnLowerNumber, colunaCount, linhaCount, varsOnBase){
	var lowerResult = 99999999999999999999999;
	var lowerResultRow;

	
	for(let i = 0; i < linhaCount-1 ; i++){
		
		if(!(matriz[i][columnLowerNumber] == 0)){
			currentValue = 0;
			currentValue = matriz[i][colunaCount-1] / matriz[i][columnLowerNumber]
			
			 
			if(currentValue > 0){
				if(currentValue < lowerResult){
					lowerResult    = currentValue;
					lowerResultRow = i;
				}
			}

		}
	}
	if(lowerResultRow == undefined){
		pauseSolution()
	}else{
		
		
		varsOnBase[lowerResultRow] = "x"+(columnLowerNumber+1)
		return [ lowerResultRow, varsOnBase];
	}
	
}


function getRestrictionValues(numVar,numRes){
	var resValues = [];
	var xvalue = [];
	for (let i = 1; i <= numRes; i++ ){
		xvalue = [];

		for (let j = 1; j <= numVar; j++ ) {
			
			var input = $("input[name='X"+j+"_res"+i+"']").val();
			
			if(input.length == 0) {
				xvalue[j-1] = 0;
			} else {
				xvalue[j-1] = parseFloat(input);
			}


		}
		
		for (let j= 1; j <= numRes; j++) {
			if(i==j){
				xvalue.push(1);
			}else{
				xvalue.push(0);
			}
		}
		
		var input_res = $("input[name='valRestriction"+i+"']").val();
		
		if(input_res.length == 0) {
			xvalue.push(0);	
		} else {
			xvalue.push(parseFloat(input_res));
		}
	
		resValues[i-1] = xvalue;
		
	}
	return resValues;
}

function getFunctionzValues(numVar,numRes){
	var funcValues = [];
	var xvalue = [];

	var maxOrMin = (($("#max").is(':checked')) ? -1 : 1);

	for (let i = 1; i <= numVar; i++ ) {
		var input = $("input[name='valX"+i+"']").val()

		if( input.length == 0) {
			xvalue[i-1] = 0;			
		} else {
			xvalue[i-1] = parseFloat(input) * maxOrMin;
		}

	}
	funcValues = xvalue ;

	for (let i = 0; i <= numRes; i++) {
		funcValues.push(0);
	}

	return funcValues;
}


function getLowerNumberAndColumn(matriz,linhaCount,columnCount){
	var column = 0;

	linhaCount -= 1;

	var lowerNumber = matriz[linhaCount][0];


	for (let j = 1 , i = linhaCount ; j < columnCount - 1 ; j++) {
		
		if(matriz[i][j] < lowerNumber){
			lowerNumber = matriz[i][j];
			column = j;
		}
	}
	return [lowerNumber , column] ;
}


function pauseSolution(){
	$(".container").remove()

	$("body").append('<div class="container"><div class="row"><div class="offset-md-2 col-md-8 offset-md-2"><h1>Solução impossível</h1></div></div></div>');
	$(".container").append('<div class="row"><div class="offset-md-4 col-md-4 offset-md-4"><button id="back" class="btn btn-primary" onclick="location.reload();" >Voltar</button></div>	</div>')
}



 
function primeira(){
	$(document).ready(function () {
		
		
		var numVar = $("input[name=numVar]").val();
		if( numVar.length == 0 || numVar == '0') {
			alert('Você precisa inserir alguma quantia em variavel de decisão');	
			return;	
		} else {
			numVar = parseFloat(numVar);
			if(numVar < 1){
				return;
			}
		}

		
		var numRes = $("input[name=numRes]").val();
		if( numRes.length == 0 || numRes == '0') {
			alert('Você precisa inserir alguma quantia em variavel de restrição');	
			return;	
		} else {
			numRes = parseFloat(numRes);
			if(numRes < 1){
				return;
			}
		}


		$("#primeira").remove();
		$("#startInputs").hide();

		generateFunctionZ(numVar);
		
		generateRestrictions(numVar,numRes);

		$("#inputValues").append('<div id="buttons" class="row"><div class="col-md-6"><button id="resolver" onclick="resolver('+numVar+','+numRes+',1)" class="btn btn-primary">Solução direta</button></div></div>');

		$(".container").append('<div id="solution" class="row"></div>')
		$(".container").append('<br><div class="row"><div id="results" class="col-md"></div></div>');

		$("#buttons").append('<div class="col-md-6"><button id="stepByStep" onclick="resolver('+numVar+','+numRes+',2)" class="btn btn-primary">Passo a Passo</button></div>');

	});
}


function generateFunctionZ(numVar){


	$(".container").append('<div id="inputValues"></div>');
	$("#inputValues").append('<br><div class="row"><div class="input-group d-flex justify-content-center mb-3" id="funcZ"></div></div>');

	
	$("#funcZ").append('<h2>Função Z =</h2><span class="px-2">');
	 	
	for (let i = 1; i <= numVar; i++) {

		$("#funcZ").append('<input type="number" name="valX'+i+'">');
		if(i != numVar){
			$("#funcZ").append('<div class="input-group-append"><span class="input-group-text">x'+ i +'</span></div><span class="px-2"><span><button tabindex=-1 class="btn btn-dark btn-lg">+</button>');
		}else{
			$("#funcZ").append('<div class="input-group-append"><span class="input-group-text">x'+ i +'</span></div>');
		}
	}
	var input = $('input[name="valX1"]');

	var input = $('input[name="valX1"]');

	input.focus();
}



function generateRestrictions(numVar,numRes){

	$("#inputValues").append('<div class="row"><div class="col-md-12 mb-3" id="divRestTitle"><h2>Restrições:</h2></div></div>');

	 
	for (let i = 1; i <= numRes ; i++) {

			$("#inputValues").append('<div class="row"><div class="input-group d-flex justify-content-center mb-3" id=divRes'+i+'></div></div>');

			for (let j = 1; j <= numVar; j++) {
				$("#divRes"+i+"").append('<input type="number" name="X'+j+'_res'+i+'" " >');
				if(j != numVar){
					$("#divRes"+i).append('<div class="input-group-append"><span class="input-group-text">x'+ j +'</span></div><span class="px-2"><span><button tabindex=-1 class="btn btn-dark btn-lg">+</button>');
				}else{
					$("#divRes"+i).append('<div class="input-group-append"><span class="input-group-text">x'+ j +' </span></div>');
				}
			}
		
		$("#divRes"+i).append('<span class="px-2"></span><div class="input-group-prepend"><span class="input-group-text"><b>&le;</b></span></div><input type="number" name="valRestriction'+i+'">');
	}

	
}




  
