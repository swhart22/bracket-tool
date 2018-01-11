import sheetsy from 'sheetsy';
const {urlToKey, getWorkbook, getSheet } = sheetsy;
import desktop from './desktop.js';
import polls from './polls.js';

//change this to the appropriate spreadsheet url
const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1R8A_X3mQl872Cwroc947SAtFyw7xyqW3m_BJNU3sLjM/edit#gid=0";

const key = urlToKey(SPREADSHEET_URL);

//specify whether bracket is 16 or 32

//32 NOT SUPPORTED YET!
const size = 16;

const metadata = {
	key: key,
	size: size
};

//grabs the data, then draws the chart, then draws the polls

getSheet(metadata['key'], 'od6').then((stuff) => {
	console.log(stuff);
	var data = [];
	
	stuff.rows.forEach((d, i) => {
		var o = {};
		o['Seed'] = d['seed'];

		o['Competitor - Round 1'] = d['competitor-round1'];
		o['Poll ID - Round 1'] = d['pollid-round1'];
		o['Result - Round 1'] = d['result-round1'];

		o['Competitor - Round 2'] = d['competitor-round2'];
		o['Poll ID - Round 2'] = d['pollid-round2'];
		o['Result - Round 2'] = d['result-round2'];

		o['Competitor - Round 3'] = d['competitor-round3'];
		o['Poll ID - Round 3'] = d['pollid-round3'];
		o['Result - Round 3'] = d['result-round3'];

		o['Competitor - Round 4'] = d['competitor-round4'];
		o['Poll ID - Round 4'] = d['pollid-round4'];
		o['Result - Round 4'] = d['result-round4'];
		
		data.push(o);
	});
	
	return data;

}).then((data) => {
	//once data is loaded, execute draw and polls functions
	//from ./draw.js
	var container = document.querySelector("#container");
	var wWidth = container.offsetWidth;

	console.log(wWidth);
	if (wWidth >= 400){
		desktop(data);
	}
	else{
		//draw(data);
	}

	//from ./polls.js
	polls(data);
});

export default metadata;