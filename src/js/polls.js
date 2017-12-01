import * as d3 from 'd3';

function embed(id) {
	return '<iframe class="excite_s" src="http://excitem.com/nbc/web/form_new.php?station_id=&id='+id+'&state=show_poll" width="305" height="305" style="border: 0px; margin-bottom: 20px; overflow: hidden; height: 228px;" frameborder="0" allowtransparency="true" scrolling="no"></iframe>';
}

function polls(data){
	//var pollsForFinals = d3.map((d => {return d['Poll 4 ID'];}).keys());
	var pollsForFinals = d3.map(data, d => {return d['Poll 8 ID'];}).keys().filter(e => {return e != 'out';});

	pollsForFinals.forEach(p => {
		d3.select('#polls')
			.append('div')
			.attr('class','excitemInfo')
			.html(() => { return embed(p) });
	});

	
}
export default polls;