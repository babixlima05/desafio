												
												/*Variaveis*/
var calendar, startDate, endDay, firstDay;
var firstWeekDay, lastWeekDay, week, weekRange, weeks;
var endWeek, dayClass;
var row, headerRow, i, j, k, val;
var len, lin;
var qtdAtividades, act;

											/*Variaveis globais*/
// Representam a agenda, a data atual (não muda), o ano e o mes (mudam de acordo com a mudanca no calendario 
top.agenda, top.date, top.year, top.month;

//---------------------------------------------------------------------------------------------------------------//

											/* classe Activity*/
// Contem as informações importantes de cada atividade (hora, tempo e descricao)
class activity{
	constructor (hour, time, what){
		this.hour = hour;
		this.time = time;
		this.what = what;
	}	
};
										/* classe eventsDayMonth*/

// É um array formado de eventos ESPECIFICOS DE CADA DIA. (ou seja, cada data que 
// contem um evento, deve-se criar um objeto da classe abaixo) 

class eventsDayMonth{

	// Foi necessario criar a variavel quant dentro desse classe para que, em um dia me que nao tenha nenhuma
	// atividade, o retorno da funcao getQuantidade() seja 0
	constructor(){
		this.activity = [];
		this.quant = 0;
	}

	// Funcao para adicionar uma atividade no dia
	addAtivity(ativ){
		(this.activity).push(ativ)
		this.quant++;
	}

	// Funcao que retorna o numero de atividades no dia
	getQuantidade(){
		return this.quant;
	}

	// Funcao que retorna uma string com a descricao da atividade i
	getActivity(i){
		lin = "";
		lin += this.activity[i].what + " as " + this.activity[i].hour + " horas com duracao de "
		+ this.activity[i].time + " h";
		return lin;
	}
};
										/* classe createAgenda */

// É uma matriz que contem todos os eventos do ano atual. Ela é organizada de forma que cada linha
// representa um mês (portanto, o dia 1 do primeiro mês é o objeto [0][1])
// OS MESES COMECAM NO 0 E OS DIAS NO 1 (isso ocorreu por conta do retorno da biblioteca moment.js que retorna os meses
// começando pelo índice 0, enquanto os dias são retornados pelos seus valores reais )

class createAgenda{

	constructor(){
		// Contrucao da matriz
		this.events = [];
		for(i = 0; i < 12; i++){
			this.events[i] = [];
			
			for(j = 1; j <= 31; j++){
				// Colocando cada elemento da matriz como um objeto da classe eventsDayMonth
				this.events[i][j] = new eventsDayMonth();
			}
		}
	}

	// Função para adicionar um evento na agenda
	addAgenda(day, month, eventsDayMonth){
		this.events[month][day] = eventsDayMonth;
	}
	
	// Funcao que retorna o numero de atividades naquele dia
	getQtd(day, month){
		return (this.events[month][day]).getQuantidade();
	}

	// Funcao que retorna uma string com a descricao das atividades daquele dia 
	getActivity(day, month){
		act = "";

		for(i = 0; i < (this.events[month][day]).getQuantidade(); i++){
			act += this.events[month][day].getActivity(i) + "<br>";
		}

		return act;
	}
};

								/* Função agenda para criar a agenda*/

// Inicialmente, criamos as atividades e associamos cada uma a um dia especifico do ano, apos isso, foi criada
// a agenda e, por fim, adicionamos os dias com os seus respectivos eventos 
function eventsCalendar(){

	// Criando as atividades
	at1 = new activity(12, 1, "almoco com Mark");
	at2 = new activity(16, 2, "reuniao");
	at3 = new activity(8, 1, "viagem para Sao Paulo");

	// Selecionando as atividades no dia1
	day1 = new eventsDayMonth();
	day1.addAtivity(at1);
	day1.addAtivity(at2);

	// Selecionando as atividades no dia2
	day2 = new eventsDayMonth();
	day2.addAtivity(at3);

	// Criando a agenda e colocando os dias com atividades nela
	agenda = new createAgenda();
	agenda.addAgenda(5, 9, day1);
	agenda.addAgenda(15, 10, day2);

	return agenda;
	
}


						/*Função para adicionar o numero de atividades do dia no calendario*/

// Para isso, foi adicionada o codigo dentro das tags tbody na table com id ="calendar"

function AdicionarNumberActivity(qtd){
	$("#calendar tbody").append("<td class=\"remover\"> <a class= \"event\">" + qtd+"</a> </td>");
};


									/* Função para adicionar a agenda*/

// Para isso, analisamos a quantidade de atividades de cada dia do ano, e, quando não era nulo, apresentar a atividade
// com a hora, o tempo e a sua descricao
function AdicionarAgenda(){
	var dia, mes;
	// Iterando sobre o ano
	for(mes = 0; mes < 12; mes++){
		for(dia = 1; dia <= 31; dia++){	

			if(agenda.getQtd(dia, mes) != 0){
				
				// Primeiro, vamos escrever a data do evento
				$("<table <tr> <th id =\"agendaTop\" class = >" + dia + "/" + mes + "</th> </tr> </table").appendTo($("#agenda"));
				
				// Depois, a descrição da atividade
				$("<table><td>" + agenda.getActivity(dia, mes) + "</td> </table>" ).appendTo($("#agenda"));
				
				
			}
			
		}
	}

};


//--------------------------------------------------------------------------------------------------------

											/* Função para obter o calendário*/

// Dentro dessa função, utilizando a biblioteca moment.js fora obtido uma matriz na qual cada linha é
// a semana do ano (obs: começando pelo indice zero) e cada coluna é o dia da semana (começando pelo domingo)
function get_calendar(year, month){
	var day, sun;
	// Para não alterar a data selecionada, foi criada uma variavel momt que é o clone da variavel que contem o dia selecionado
	var momt = moment(moment([year, month]));

	//Primeiro, encontramos o primeiro e o ultimo dia do mês
	firstDay = moment([year, month]).startOf('month');
	endDay = moment([year, month]).endOf('month');
	//E, tambem, encontramos o numero da ultima semana
	endWeek = endDay.week();
	
	//Inicializando os arrays weeks, calendar e weekRange
	weeks = [];
	calendar = [];
	weekRange = [];

	// Se a ultima semana estiver contida no proximo ano, essa será a semana um
	// Para que o calendario seja completado, é necessário considerar esse semana como 
	// a 53º semana (considerando que um ano tem 52 semanas, por exemplo).
	if (endDay.week() == 1){
		endWeek = endDay.subtract(1, 'week').week();
		endWeek++;
	}
	
	// O array weeks contem o numero das semanas daquele mes que ira ser apresentado na tela
	for(week = firstDay.week(); week <= endWeek; week++){
		weeks.push(week);
	}

	// Para cada semana desse mes, vamos analisar
	for(i = 0, len = weeks.length; i < len; i++){
		week = weeks[i];
		
		// Para que o calendario seja apresentado comecando no domingo, é necessario que o primeiro elemento de
		// cada linha seja o sunday (day(7)) da semana anterior, pois o momentjs reconhece a semana comecando pela
		// segunda
		

		// Quando o numero da ultima semana é 1, significa que mudou de ano
		if (endDay.week() == 1){
			// Adicionando primeiro o domingo
			sun = momt.clone().year(year + 1).week(week - 1).day(7);
			weekRange.push(sun);

			// Depois, adiciona o resto da semana
			for(j = 1; j<= 6; j++){
				day.momt.clone().year(year + 1).week(week).day(j);
				weekRange.push(day);
			}
		}
		// De forma analoga, porem sem mudar o ano
		else {
			sun = momt.clone().week(week - 1).day(7);
			weekRange.push(sun);
			for (j = 1; j <= 6; j++){
				day = momt.clone().week(week).day(j);
				weekRange.push(day);
			}
		}

		// Adicionando a semana no calendario
		calendar.push(weekRange);
		// Retirando os elementos do array para criar nova semana
		weekRange = [];
	}
	return calendar;
};

									/* Funcao para voltar 1 mes*/

// Para voltar um mes, deveremos analisar quando o mes é janeiro (ou seja, month == 0), pois, para voltar um mes
// é necessario reduzir em uma unidade a variavel year e selecionar o mes de dezembro (month = 11).
// Em outros casos só é necessário reduzir uma unidade na variavel month

function previousMonth(){
	if(month == 0){
		this.month = 11;
		this.year = year - 1;
	}
	else{
		this.month = month - 1;
	}

	// Por fim, chamamos o loop () para atualizar o calendario
	loop(year,month);
};

									/*Função para adiantar um mes*/

// De forma analoga ao previousMonth(), se o mes e dezembro (month == 11), devemos aumentar uma unidade na variavel
// year e selecionar o mes de janeiro (month = 0).
// Em outros casos so e necessario aumentar uma unidade na variavel month

function nextMonth(){
	if(month == 11){
		this.month = 0;
		this.year = year + 1;
	}
	else{
		this.month = month + 1;
	}
	// Chamada do loop para atualizar o calendario
	loop(year,month);
};

							/*Função para adicionar os dias na tabela do calendario*/

// Para isso, foi utilizada a função append() para adicionar o codigo abaixo dentro da tag tbody na table com
// id = "calendar"

// Nas tags dos dias do calendario foi adicionada classes de forma a mudar as caracteristicas: o dia atual, 
// o dia selecionado e os os dias do mes anterior (se esta apresentando o calendario de outubro, os dias que 
// forem de outros meses mas que estiverem na tela, estarao com cores diferentes)

function AdicionarDay(day, dayClass, val){
    $("#calendar tbody").append(
    	"<td class =\"remover\"> <a href=\"#\" id=\"data\" class=\""+ dayClass +"\" + value=\""+val+"\">" 
    	+ day.format("DD"));
};

 //--------------------------------------------------------------------------------------------------------------------//

							/*Função que contem o loop para atualizar o calendario*/
function loop (){
	//Primeiro, remove-se todas as tag td, ou seja, é retirada todas as datas que estavam na tela
	$("td").remove(".remover");
	
	// Atualiza-se o calendario
	calendar = get_calendar(year, month);

	// Iterando sobre o calendario
	for(i = 0; i < calendar.length; i++){
		
		// Primeiro, adiciona-se a tag <tr> no <tbody> da table com id="calendar" para que cada semana
		// fique em uma linha
		$("#calendar tbody").append("<tr>");
		
		// Iterando sobre as semanas
		for(j = 0; j < 7; j++){
			// Primeiro, todas os dias do calendario estarao com a classe calendar_day
			dayClass = "calendar_day ";
			
			// Adicionando as classes today e selected no dia atual
			if(calendar[i][j].format("DD-MM") == this.date.format("DD-MM")){
				dayClass += "calendar_day--today " + "calendar_day--selected";
			}

			// Adicionando a classe muted nos dias que estiverem no mes anterior ou posterior ao analisado
			if(calendar[i][j].format("MM") != this.month + 1){
				dayClass += "calendar_day--muted ";
			}

			// Variavel que contem, em um array o dia e o mes, de forma que cada data tem em value o dia e o mes que 
			// ela representa, para que possamos atualizar a agenda
			val = [calendar[i][j].date(), calendar[i][j].month()];

			// Adicionando o dia no calendario
			$("#calendar tbody").append(AdicionarDay(calendar[i][j], dayClass, val));

		}
		// Agora, vamos apresentar o numero de atividades que tem em cada dia, para isso, vamos apresentar
		// esse valores abaixo dos dias no calendario
		$("#calendar tbody").append("</tr> <tr>");
		for(j = 0; j < 7; j++){
			// Como a agenda so foi feita para esse ano, e necessario fazer a variavel val ser nula 
			// quando o ano nao e igual a 2017 para que nao haja problemas
			val = 0;
			if(year == 2017){
				val = agenda.getQtd(calendar[i][j].date(), calendar[i][j].month());
			}

			// Adicionando o numero de atividades no calendario
			$("#calendar tbody").append(AdicionarNumberActivity(val));
		}

		$("#calendar tbody").append("</tr>");
	}
};

						/* Função para destacar uma data quando ela for selecionada*/

// Cada dia do calendario é uma tag "a" com uma id = "data", ou seja, quando alguma data for selecionada
// é processada essa função
$(document).on('click', 'a[id*="data"]', function() {
	// Primeiro, vamos retirar o destaque de qualquer outra data , ou seja, deve-se retirar todas as classes selected
	$("a[class*='calendar_day--selected']").removeClass("calendar_day--selected");

	// Apos isso, adicionamos a classe selected para a data selecionada, para que ela seja destacada das demais
	$(this).addClass("calendar_day--selected");       	

});

$(document).on('click', 'th[id*="agendaTop"]', function() {
	// Primeiro, vamos retirar o destaque de qualquer outra data , ou seja, deve-se retirar todas as classes selected
	$("th[class*='agenda--selected']").removeClass("agenda--selected");

	// Apos isso, adicionamos a classe selected para a data selecionada, para que ela seja destacada das demais
	$(this).addClass("agenda--selected");       	

});

				/*Essa funcao serve para inicializar algumas variaveis e para adicionar a agenda*/

// Como essa funcao so roda uma vez, ela foi utilizada para inicilizar as variaveis com a data atual
// para chamar a funcao para criar a agenda e, para dispo-la na tela
// e, por fim, para chamar a funcao loop()
$(function(){
	

	date = moment();
	year = moment().year();
	month = moment().month();
	
	agenda = eventsCalendar();

	AdicionarAgenda();
	
	loop();
});

//----------------------------------------------------------------------------------------------------------------------//
/* Por conta de tempo, nao consegui implementar tudo, ficou faltando o scroll no calendario e alguns detalhes, 
mas a minha ideia era:

-> arrumar as tabelas da agenda, de forma que cada dia seja uma tabela (agora, a data é uma tabela e as info sao outra)

-> Primeiro, implementar o scroll da agenda ao selecionar uma data no calendario
1) Colocar uma id e uma class em cada elemento da agenda

2) Criar uma classe para selecionar um elemento da agenda (agenda--selected)

3) Quando uma data no calendario é selecionada, é alterada a classe do elemento correspondente da agenda
que encontramos utilizando o value do elemento do calendario 
(ele foi implementado de forma que o value dele seja o dia e o mes) 

-> pensei em chamar o adicionarAgenda na funcao que é chamada quando um elemento do calendario é clicado

4) Mudar a funcao adicionarAgenda para analisar se a data é a selecionada, se for, colocar a classe agenda--selected 
no elemento

5) Dentro da funcao que é chamada quando um elemento do calendario é clicado, incluir uma funcao para dar scroll ate o
elemento da agenda com a class selected -> pelo que busquei, encontrei uma funcao que talvez de certo para isso, mas
pensei, tambem, que, em vez de fazer isso, poderia criar uma funcao para atualizar a agenda, recebendo como o
parametro o dia e mes que foi selecionado, e que iria ser apresentada na tela comecando por esse dia.

-> Depois, implementar o scroll do calendario ao selecionar uma data na agenda

6) Criar uma funcao analoga a funcao de quando um elemento do calendario é clicado para os elementos da agenda

7) De forma analoga, tambem, alterar a classe do elemento do calendario correspondente a data selecionada na agenda para 
calendar_day--selected

8) Apos isso, alterar as variaveis globais month e year para a data selecionada. Por fim, chamar o loop () para atualizar
o calendario.

-> alguns detalhes de organizacao da tela
*/