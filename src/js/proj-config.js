import sheetsy from 'sheetsy';
const {urlToKey, getWorkbook, getSheet } = sheetsy;
import draw from './draw.js';
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
	//console.log(stuff);
	var data = [];
	
	stuff.rows.forEach((d, i) => {
		var o = {};
		o['Seed'] = d['seed'];
		o['Competitor'] = d['competitor'];
		o['Poll 4 ID'] = d['poll4id'];
		o['Poll 8 ID'] = d['poll8id'];
		o['Poll 16 ID'] = d['poll16id'];
		o['Poll 32 ID'] = d['poll32id'];
		o['Result Final 2'] = d['resultfinal2'];
		o['Result Final 4'] = d['resultfinal4'];
		o['Result Final 16'] = d['resultfinal16'];
		o['Result Final 8'] = d['resultfinal8'];
		o['Result Winner'] = d['resultwinner'];
		data.push(o);
	});
	
	return data;

}).then((data) => {
	//once data is loaded, execute draw and polls functions
	//from ./draw.js
	draw(data);

	//from ./polls.js
	polls(data);
});

export default metadata;