import _ from 'lodash';
import '../css/nbcotsbase.css';
//import data from '../../data/data.csv';
import * as d3 from 'd3';
import colors from './colors.js';
import lines from './lines.js';
import sheetsy from 'sheetsy';
const {urlToKey, getWorkbook, getSheet } = sheetsy;
import metadata from './proj-config.js';

getSheet(metadata['key'], 'od6').then(stuff => {
	//console.log(stuff);
	var data = [];
	var datanew = stuff.rows;
	
	datanew.forEach((d, i) => {
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
		o['Result Winner'] = d['resultwinner'];
		data.push(o);
	});
	console.log(data);

	//the actual graphic
	var width = parseInt(d3.select('#container').style("width"));
	var height = parseInt(d3.select('#container').style("height"));
	var margin = {left:10, top:10, right:10, bottom:10};
	var cHeight = height - margin.top - margin.bottom;
	var cWidth = width - margin.left - margin.right;
	var container = d3.select('#container');
	var colWidth = cWidth / 7;

	var svg = container
		.append('svg')
		.attr("width",width)
		.attr('height',height);

	var g = svg
		.append('g')
		.attr('transform','translate('+margin.left+','+margin.top+')');

	var chunk = cHeight / (data.length / 2);
	var padding = 60;

	var polls32 = d3.nest()
		.key(d => {return 'poll-' + d['Poll 32 ID']})
		.entries(data);

	var polls16 = d3.nest()
		.key(d => {return 'poll16-' + d['Poll 16 ID']})
		.entries(data.filter(d => {return d['Poll 16 ID'] != 'out'}));

	var polls8 = d3.nest()
		.key(d => {return 'poll8-' + d['Poll 8 ID']})
		.entries(data.filter(d => {return d['Poll 8 ID'] != 'out'}));

	var polls4 = d3.nest()
		.key(d => {return 'poll4-' + d['Poll 4 ID']})
		.entries(data.filter(d => {return d['Poll 4 ID'] != 'out'}));

	console.log(polls4);

	var drawLine = d3.line()
		.curve(d3.curveBasis)
		.x(d => {return d.x})
		.y(d => {return d.y});

	var lineWidth = 150;

	var scaleFactor = colWidth / lineWidth;

	var pollgroups = g
		.selectAll('.round1-polls')
		.data(polls32)
		.enter()
		.append('g')
		.attr('class','round1-polls')
		.attr('transform', (d, i) => {
			var ypos = (cHeight / (polls32.length / 2)) * (i % (polls32.length / 2));
			if (i < (polls32.length / 2)){
				return 'translate(0,' + ypos + ')';
			}
			else{
				return 'translate(' + cWidth + ',' + ypos + ')';
			}
		});

	pollgroups.selectAll('.round1-paths')
		.data(d => {return d.values})
		.enter()
		.append("path")
		.attr('d', drawLine(lines['line']))
		.attr('class', d => {
			if(d['Result Final 16'] == 'LOSE'){
				return 'round1-path winpath';
			}
			else{
				return 'round1-path losepath';
			}
		})
		.attr('fill','none')
		.style('stroke-linejoin','round')
		.style('shape-rendering','geometricPrecision')
		.attr('transform', (d, i) => {
			if (i == 0 && d['Seed'] <= 8){
				return 'translate(25,25) scale(' + scaleFactor + ',1)';
			}
			else if (i == 1 && d['Seed'] <= 8){
				return 'translate(25,100) scale('+ scaleFactor +',-1)';
			}
			else if (i == 0 && d['Seed'] >8){
				return 'scale('+ -scaleFactor + ', 1) translate(25, 25) ';
			}
			else if (i == 1 && d['Seed'] > 8){
				return 'scale('+ -scaleFactor + ', -1) translate(25, -100)';
			}
		});

	container.selectAll('.round1-labels')
		.data(data)
		.enter()
		.append('div')
		.attr('class', d => {
			if(d['Result Final 16'] == 'LOSE'){
				return 'labels round1-labels winlabel';
			}
			else{
				return 'labels round1-labels loselabel';
			}
		})
		.style('position','absolute')
		.style('top', (d, i) => {
			var ypos = chunk * (i % (data.length / 2)) + 25;
			return ypos + 'px';
		})
		.style('left',(d, i) => {
			if (i <= 7){
				return 0 + 'px';
			}
			else{
				return 'auto';
			}
		})
		.style('right', (d, i) => {
			if (i <= 7){
				return 'auto';
			}
			else{
				return '0px';
			}
		})
		.style('border-color',colors['black']['003'])
		.html(d => {return d['Competitor'];});

	var data16 = data.filter(d => {return d['Poll 16 ID'] != 'out';});

	var pollgroups16 = g
		.selectAll('.round2-polls')
		.data(polls16)
		.enter()
		.append('g')
		.attr('class','round2-polls')
		.attr('transform', (d, i) => {
			var ypos = (cHeight / (polls16.length / 2)) * (i % (polls16.length / 2)) + 35;
			if (i < (polls16.length / 2)){
				return 'translate('+(colWidth*1)+',' + ypos + ')';
			}
			else{
				return 'translate(' + (cWidth - (colWidth * 1)) + ',' + ypos + ')';
			}
		});

	pollgroups16.selectAll('.round2-paths')
		.data(d => {return d.values})
		.enter()
		.append("path")
		.attr('class', d => {
			if(d['Result Final 8'] == 'LOSE'){
				return 'round2-paths winpath';
			}
			else{
				return 'round2-paths losepath';
			}
		})
		.attr('d', drawLine(lines['round two']))
		.attr('fill','none')
		.style('stroke-linejoin','round')
		.style('shape-rendering','geometricPrecision')
		.attr('transform', (d, i) => {
			if (i == 0 && d['Seed'] <= 8){
				return 'translate(25,25) scale(' + scaleFactor + ',1)';
			}
			else if (i == 1 && d['Seed'] <= 8){
				return 'translate(25,170) scale('+ scaleFactor +',-1)';
			}
			else if (i == 0 && d['Seed'] >8){
				return 'scale('+ -scaleFactor + ', 1) translate(25, 25) ';
			}
			else if (i == 1 && d['Seed'] > 8){
				return 'scale('+ -scaleFactor + ', -1) translate(25, -170)';
			}
		});

	container.selectAll('.round2-labels')
		.data(data16)
		.enter()
		.append('div')
		.attr('class', d => {
			if(d['Result Final 8'] == 'LOSE'){
				return 'labels round2-labels winlabel';
			}
			else{
				return 'labels round2-labels loselabel';
			}
		})
		.style('position','absolute')
		.style('top', (d, i) => {
			var ypos = (cHeight / (data16.length / 2)) * (i % (data16.length / 2)) + 25 + 35;
			return ypos + 'px';
		})
		.style('left', (d, i) => {
			if (i < data16.length / 2){
				return (colWidth * 1) + 'px';
			}
			else {
				return 'auto';
			}
		})
		.style('right', (d, i) => {
			if (i < data16.length / 2){
				return 'auto';
			}
			else {
				return (colWidth * 1) + 'px';
			}
		})
		.style('border-color',colors['black']['003'])
		.html(d => {return d['Competitor'];});

	var data8 = data.filter(d => {return d['Poll 8 ID'] != 'out'});

	container.selectAll('.round3-labels')
		.data(data8)
		.enter()
		.append('div')
		.attr('class', d => {
			if(d['Result Final 4'] == 'LOSE'){
				return 'labels round3-labels winlabel';
			}
			else{
				return 'labels round3-labels loselabel';
			}
		})
		.style('position','absolute')
		.style('top', (d, i) => {
			var ypos = (cHeight / (data8.length / 2)) * (i % (data8.length / 2)) + 25 + 35 + 35 + 35;
			return ypos + 'px';
		})
		.style('left', (d, i) => {
			if (i < data8.length / 2){
				return (colWidth * 2) + 'px';
			}
			else {
				return 'auto';
			}
		})
		.style('right', (d, i) => {
			if (i < data8.length / 2){
				return 'auto';
			}
			else {
				return (colWidth * 2) + 'px';
			}
		})
		.style('border-color',colors['black']['003'])
		.html(d => {return d['Competitor'];});

	var pollgroups16 = g
		.selectAll('.round3-polls')
		.data(polls8)
		.enter()
		.append('g')
		.attr('class','round3-polls')
		.attr('transform', (d, i) => {
			var ypos = (cHeight / (polls8.length / 2)) * (i % (polls8.length / 2)) + 35 + 35 + 35;
			if (i < (polls8.length / 2)){
				return 'translate('+(colWidth*2)+',' + ypos + ')';
			}
			else{
				return 'translate(' + (cWidth - (colWidth * 2)) + ',' + ypos + ')';
			}
		});

	pollgroups16.selectAll('.round3-paths')
		.data(d => {return d.values})
		.enter()
		.append("path")
		.attr('class', d => {
			if(d['Result Final 4'] == 'LOSE'){
				return 'round3-paths winpath';
			}
			else{
				return 'round3-paths losepath';
			}
		})
		.attr('d', drawLine(lines['round three']))	
		.attr('fill','none')
		.style('stroke-linejoin','round')
		.style('shape-rendering','geometricPrecision')
		.attr('transform', (d, i) => {
			if (i == 0 && d['Seed'] <= 8){
				return 'translate(25,25) scale(' + scaleFactor + ',1)';
			}
			else if (i == 1 && d['Seed'] <= 8){
				return 'translate(25,315) scale('+ scaleFactor +',-1)';
			}
			else if (i == 0 && d['Seed'] >8){
				return 'scale('+ -scaleFactor + ', 1) translate(25, 25) ';
			}
			else if (i == 1 && d['Seed'] > 8){
				return 'scale('+ -scaleFactor + ', -1) translate(25, -315)';
			}
		});

	var data4 = data.filter(d => {return d['Poll 4 ID'] != 'out'});

	container.selectAll('.round4-labels')
		.data(data4)
		.enter()
		.append('div')
		.attr('class','labels')
		.style('position','absolute')
		.style('top', (d, i) => {
			var ypos = (cHeight / (data4.length / 2)) * (i % (data4.length / 2)) + 25 + 35 + 35 + 35 + 35 + 35 + 35 + 35;
			return ypos + 'px';
		})
		.style('left', (d, i) => {
			if (i < data4.length / 2){
				return (colWidth * 3) + 'px';
			}
			else {
				return 'auto';
			}
		})
		.style('right', (d, i) => {
			if (i < data4.length / 2){
				return 'auto';
			}
			else {
				return (colWidth * 3) + 'px';
			}
		})
		.style('border-color',colors['black']['003'])
		.html(d => {return d['Competitor'];});

	//styles based on win/lose

	d3.selectAll('.winpath')
		.style('stroke', colors['blue']['004'])
		.style('stroke-width', 1.5);

	d3.selectAll('.losepath')
		.style('stroke', colors['black']['003'])
		.style('stroke-dasharray','2,2')
		.style('stroke-width',0.5);

	d3.selectAll('.winlabel')
		.style('font-weight', 700)
		.style('border-style', 'solid');
			
});
