function b_gauss(sSelector){
    var g = this;
    
    //Data
    g.init(sSelector);
    g.numberOfX         = 4;
    g.numberOfEquations = 4;
    g.table             = g.find('.b-form__table');
    g.trLast            = g.find('.b-form__table  tr:last');
    g.solutionContainer = g.find('#solution');
    g.solutionTable     = g.find('.b-form__solution_table');
    g.button            = g.find('.b-form__ok_button');
    g.solutionText      = g.find('.b-form__solution_text');
    g.x                 = [];
	g.solver			= new b_gauss__solver();
    
    //Methods
    g.printTable = function(){
        for (var i = 2; i <= g.numberOfEquations; i++){
            var row = g.trLast.clone();
            var inputj = 0;
            row.find('input').each(function(){
                inputj++;
                var c = (inputj > g.numberOfX) ? ('b_' + i) : ('x' + inputj + '_' + i);
                $(this).removeClass();
                $(this).addClass('b-form__' + c);
                });
            var inputj = 0;
            row.find('label').each(function(){
                var c='';
                if (inputj == 0) {
                    c = 'b-form__label_eqnumber-' + i;
                    $(this).html(i + ')');
                }
                else {
                    c = 'b-form__label_plus-x';
                }
                inputj++;
                $(this).removeClass();
                $(this).addClass(c);
                });
            g.table.append(row);
            }
        }
    g.setTable = function(aMatrix){
        for (var i = 0; i < aMatrix.length; i++){
            for (var j = 0; j < aMatrix[i].length; j++){
                if (j < (aMatrix[i].length - 1)) {
                    g.table.find('.b-form__x' + (j + 1) + '_' + (i + 1)).val(aMatrix[i][j]);
                    }
                    else {
                    g.table.find('.b-form__b_' + (i + 1)).val(aMatrix[i][j]);
                    }
                }
            }
        }
    g.getTable = function(){
        var aMatrix = [];
        for (var i = 0; i < g.numberOfEquations; i++){
            aMatrix[i] = [];
            for (var j = 0; j <= g.numberOfX; j++){
                if (j < g.numberOfX) {
                    aMatrix[i][j] = new Fraction(+g.table.find('.b-form__x' + (j + 1) + '_' + (i + 1)).val());
                    }
                    else {
                    aMatrix[i][j] = new Fraction(+g.table.find('.b-form__b_' + (i + 1)).val());
                    }
                }
            }
        return aMatrix;
        }
    g.showSolution = function(oSteps){
        for (var i = 0; i < oSteps.length; i++){
            var s = g.solutionTable.clone().append(oSteps[i]);
            g.solutionContainer.append(s);
            g.solutionText.append('. ');
            }
        }
    g.solution = function() {
        g.solutionContainer.empty();
        g.solutionText.html('Computing. ');
        g.matrix = g.getTable();
        g.solutionSteps = [];
        g.result = g.solver.solve(g.matrix);
        if (!g.result.x.length) {
			g.showSolution(g.result.solutionSteps);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"solution"])
            MathJax.Hub.Queue(function(){
				g.solutionText.append("Can't find solution!");
            });
            }
        else {
			g.vectors = g.solver.vectorE(g.matrix, g.result.x);
			g.showSolution(g.result.solutionSteps);
			g.showSolution(g.vectors.show);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"solution"])
            MathJax.Hub.Queue(function(){
                g.solutionText.append("Solution found:");
            });
		}
    }
    g.main = function(){
        g.printTable();
        g.setTable(settings.get('matrix'));
        }
    
    //Events
    //$(document).ready(g.main);
    g.elem.ready(g.main);
    g.button.click(g.solution);
}

b_gauss.prototype = new component();