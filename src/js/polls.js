import * as d3 from 'd3';

function embed(id) {
	return '<iframe class="excite_s" src="http://excitem.com/nbc/web/form_new.php?station_id=&id='+id+'&state=show_poll" width="305" height="305" style="border: 0px; margin-bottom: 20px; overflow: hidden; height: 228px;" frameborder="0" allowtransparency="true" scrolling="no"></iframe>';
}

function polls(data){

	var round1polls = d3.map(data, d => {return d['Poll ID - Round 1'];}).keys();

	var round2polls = d3.map(data, d => {return d['Poll ID - Round 2'];}).keys();

	var round3polls = d3.map(data, d => {return d['Poll ID - Round 3'];}).keys();

	var round4polls = d3.map(data, d => {return d['Poll ID - Round 4'];}).keys();

	function checkRound(){
		if (round1polls.length == 8 && round2polls.length <= 1){
			return round1polls;
		}
		else if (round2polls.length >= 2 && round3polls.length <= 1){
			return round2polls;
		}
		else if (round3polls.length >= 2 && round4polls.length <= 1){
			return round3polls;
		}
		else if (round4polls.length >= 2){
			return round4polls;
		}
	};

	console.log(round2polls);
	console.log(round3polls.length);
	var currentPolls = checkRound();

	currentPolls.forEach(p => {
		d3.select('#polls')
			.append('div')
			.attr('class','excitemInfo')
			.html(() => { return embed(p) });
	});

	
}
export default polls;