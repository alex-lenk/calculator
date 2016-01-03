/*jslint node: true */
/*jshint strict:false */
/* jshint -W097 */
/* jshint node: true */
/*jshint -W089 */
'use strict';

var Calculator = {
	resultsId:    'counting-result',
	resultsValue: '0',
	memoryId: 'board-calculator',
	memoryValue: '',
	historyId: 'calc-history-list',
	historyValue: [],
	PLUS: ' + ',
	MIN: ' - ',
	DIV: ' / ',
	MULT: ' * ',
	PERC: '%',
	SIN: 'sin(',
	COS: 'cos(',
	MOD: ' mod ',
	BRO: '(',
	BRC: ')',
	equally: function () {
		this.historyValue.push(this.memoryValue);
		this.resultsValue = this.engine.exec(this.memoryValue);
		this.addToHistory();
		this.refresh();
	},
	put: function (value) {
		this.memoryValue += value;
		this.updateMemory();
	},
	reset: function () {
		this.memoryValue = '';
		this.resultsValue = '0';
		this.clearHistory();
		this.refresh();
	},
	refresh: function () {
		this.updateResult();
		this.updateMemory();
	},
	updateResult: function () {
		document.getElementById(this.resultsId).value = this.resultsValue;
	},
	updateMemory: function () {
		document.getElementById(this.memoryId).value = this.memoryValue;
	},
	addToHistory: function () {
		if (isNaN(this.resultsValue) === false) { // вместо трех равно можно поставить два!
			var div = document.createElement('li'), tag = document.getElementById(this.historyId);
			div.innerHTML = this.memoryValue + ' = ' + this.resultsValue;
			tag.insertBefore(div, tag.firstChild);
		}
	},
	clearHistory: function () {
		$('#' + this.historyId + '> li').remove();// вот тут проблема
	},
	engine: {
		exec: function (value) {
			try {
				return eval(this.parse(value)); // eval is evil - потенциальное место для атаки
			} catch (e) {
				return e;
			}
		},
		parse: function (value) {
			if (value !== null && value !== '') {
				value = this.replaceFun(value, Calculator.PERC, '/100');
				value = this.replaceFun(value, Calculator.MOD, '%');
				value = this.addSequence(value, Calculator.PERC);
				value = this.replaceFun(value, 'sin', 'Math.sin'); // нижний регистр, тогда как в значении верхний!? 
				value = this.replaceFun(value, 'cos', 'Math.cos');
				return value;
			} else {
				return '0';
			}
		},
		replaceFun: function (txt, reg, fun) {
			return txt.replace(new RegExp(reg, 'g'), fun);
		},
		addSequence: function (txt, fun) {
			var list = txt.split(fun), line = '', nr;
			for (nr = 0; nr < list.length; nr = nr + 1) { // nr in list  nr++
				if (line !== '') {
					line = '(' + line + ')' + fun + '(' + list[nr] + ')';
				} else {
					line = list[nr];
				}
			}
			return line;
		}
	}
};

$(document).keypress(function(e) {
  var element = $('*[data-key="'+e.which+'"]');

  var fun = function(element){
    // skip if this is no a functional button
    if (element.length == 0){ return true }

    if (element.data('constant') != undefined){
      return Calculator.put(Calculator[element.data('constant')]);
    }

    if (element.data('method') != undefined){
      return Calculator[element.data('method')]();
    }

    return Calculator.put(element.html());
  }

  if (fun(element) != false){
    return false
  } else {
    return true
  }
});

$(document).ready(function() {

  $(".btn").click(function(e) {
    e.preventDefault();

    if ($(this).data('constant') != undefined){
      return Calculator.put(Calculator[$(this).data('constant')]);
    }

    if ($(this).data('method') != undefined){
      return Calculator[$(this).data('method')]();
    }

    return Calculator.put($(this).html());
  });
});


/* This code does not relate to the calculator. */
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})