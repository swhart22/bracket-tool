import sheetsy from 'sheetsy';
const {urlToKey, getWorkbook, getSheet } = sheetsy;

//change this to the appropriate spreadsheet url
const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1R8A_X3mQl872Cwroc947SAtFyw7xyqW3m_BJNU3sLjM/edit#gid=0";

const key = urlToKey(SPREADSHEET_URL);

//specify whether bracket is 16 or 32
const size = 16;

const metadata = {
	key: key,
	size: size
}


export default metadata;