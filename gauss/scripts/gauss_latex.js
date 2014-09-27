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
    g.setSystem = function(aMatrix){
        var aSystem = [];
        for (var i = 0; i < aMatrix.length; i++){
            aSystem[i] = g.getLeftPartFromRow(aMatrix, i);
            aSystem[i] += '=' + g.getRightPartFromRow(aMatrix, i);
            }
        return aSystem;
        }
    g.getLeftPartFromRow = function(aMatrix, iRow){
        var str = ''
        for (var j = 0; j < aMatrix[iRow].length - 1; j++){
                var k = aMatrix[iRow][j];
                if (k.numerator > 0) {
                    var sign  = !(str == '') ? '+' : '';
                    var value = (k.denominator == 1 ? (k.numerator == 1 ? '' : k.numerator) : g.showFrac(k));
                    }
                else if (k.numerator < 0) {
                    var sign  = '-';
                    var value = (k.denominator == 1 ? (k.numerator == -1 ? '' : -k.numerator) : g.showFrac(k.multiply(-1))); 
                    }
                else {
                    continue;
                    }
                //k = k.toString().replace(/^-?\d*\.?|0+$/g, '').length > g.el ? k.toFixed(g.el) : k;
                str += sign + value + 'x_' + (j + 1);
            }
        return str;
        }
    g.getRightPartFromRow = function(aMatrix, iRow){
        //var k = +aMatrix[iRow][aMatrix[iRow].length - 1];
        //k = k.toString().replace(/^-?\d*\.?|0+$/g, '').length > g.el ? k.toFixed(g.el) : k;
        var k = aMatrix[iRow][aMatrix[iRow].length - 1];
        if (k.numerator > 0) {
            var sign  = '';
            var value = (k.denominator == 1 ? k.numerator : g.showFrac(k));
            }
        else if (k.numerator < 0) {
            var sign  = '-';
            var value = (k.denominator == 1 ? -k.numerator : g.showFrac(k.multiply(-1))); 
            }
        else {
            sign = '';
            value = '0';
            }
        return sign + value;
        }
    g.showSystem = function(aSystem, bArrow){
        var s =  '$$\\begin{cases}';
            s += aSystem.join('\\\\');
            s += '\\end{cases}' + (bArrow ? '\\Rightarrow' : '') + '$$';
        return s;
        }
    g.showSolution = function(){
        for (var i = 0; i < g.solutionSteps.length; i++){
            var s = g.solutionTable.clone().append(g.solutionSteps[i]);
            g.solutionContainer.append(s);
            g.solutionText.append('.');
            }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,"solution"])
        }
    g.showFrac = function(oFraction){
        return '\\frac{' + oFraction.numerator + '}{' + oFraction.denominator + '}';
        }
    g.solve = function(){
        g.m = g.matrix;
        var n = g.m.length;
        var aSystem = [];
        g.solutionSteps = [];
        g.solutionSteps.push(g.showSystem(g.setSystem(g.m), true));
        for (var k = 0; k < n - 1; k++){
            var k1 = k;
            while (g.m[k][k] == 0){
                // Change equations order in case akk == 0
                k1++;
                if (k1 == n) {
                    return -1;
                    }
                var r = g.m[k1];
                g.m[k1] = g.m[k];
                g.m[k] = r;
                g.solutionSteps.push(g.showSystem(g.setSystem(g.m), true));
                }
            for (var i = 0; i <= k; i++) {
                aSystem[i] = g.getLeftPartFromRow(g.m, i);
                aSystem[i] += '=' + g.getRightPartFromRow(g.m, i);
                }
            for (var i = k + 1; i < n; i++){
                aSystem[i] = g.getLeftPartFromRow(g.m, i);
                if (g.m[i][k] != 0) {
                    //var m  = - g.m[i][k] / g.m[k][k];
                    var m = g.m[i][k].divide(g.m[k][k]).multiply(-1);
                    aSystem[i] +=  '+' + g.showFrac(m) + '\(' + g.getLeftPartFromRow(g.m, k) + '\)';
                    aSystem[i] += '=' + g.getRightPartFromRow(g.m, i) + '+' + g.showFrac(m) + '\(' + g.getRightPartFromRow(g.m, k) + '\)';
                    // Equation i added with equation k + multiplied by m;
                    for (var j = k; j <= n; j++){
                        g.m[i][j] = g.m[i][j].add(g.m[k][j].multiply(m));
                        }
                    }
                }
            g.solutionSteps.push(g.showSystem(aSystem, true));
            g.solutionSteps.push(g.showSystem(g.setSystem(g.m), true));
            }
            //Solving x's
            g.x[n - 1] = g.m[n - 1][n].divide(g.m[n - 1][n - 1]);
            g.m[n - 1][n] = g.x[n - 1].clone();
            g.m[n - 1][n - 1] = new Fraction(1);
            g.solutionSteps.push(g.showSystem(g.setSystem(g.m), true));
            if (n > 1) {
                for (var i = n - 2; i >= 0; i--){
                    var m = g.m[i][n];
                    for (var j = i + 1; j < n; j++){
                        m = m.subtract(g.x[j].multiply(g.m[i][j]));    
                        g.m[i][j] = new Fraction(0);
                        }
                    g.x[i] = m.divide(g.m[i][i]);
                    g.m[i][n] = g.x[i].clone();
                    g.m[i][i] = new Fraction(1);
                    g.solutionSteps.push(g.showSystem(g.setSystem(g.m), (i > 0 ? true : false)));
                    }
                }
        return g.x;
        }
    g.vectorE = function(){
        var n = g.matrix.length;
        var m = g.matrix[0].length - 1;
        g.ve = [];
        for (var i = 0; i < n; i++){
            var ss = new Fraction(0);
            for (var j = 0; j < m; j++){
                ss = ss.add(g.matrix[i][j].multiply(g.x[j]));
                }
            g.ve[i] = ss.subtract(g.matrix[i][m]);
            }
        }
    g.solution = function() {
        g.solutionContainer.empty();
        g.solutionText.html('Computing');
        g.matrix = g.getTable();
        g.solutionSteps = [];
        var result = g.solve();
        g.showSolution();
        if (result == -1) {
            g.solutionText.append("Can't find solution, coefficients are 0!");
            }
        else {
            MathJax.Hub.Queue(function(){
                g.solutionText.append("Solution found");
            });
            g.vectorE();
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