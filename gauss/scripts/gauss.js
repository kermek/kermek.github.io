function b_gauss(sSelector){
    var g = this;
    
    //Data
    g.init(sSelector);
    g.numberOfX         = 4;
    g.numberOfEquations = 4;
    g.table             = g.find('.b-form__table');
    g.trLast            = g.find('.b-form__table  tr:last');
    g.solutionTable     = g.find('.b-form__solution_table');
    g.button            = g.find('.b-form__ok_button');
    g.solutionText      = g.find('.b-form__solution_text');
    g.tableEmpty        = $('<table>');
    g.tr                = $('<tr>');
    g.td                = $('<td>');
    g.e                 = 0.001;
    g.x                 = [];
    
    //Methods
    g.printTable = function(){
        for (var i = 2; i <= g.numberOfEquations; i++){
            var row = g.trLast.clone();
            var inputj = 0;
            row.find('input').each(function(){
                inputj++;
                var c = (inputj > g.numberOfX) ? ('b' + i) : ('x' + inputj + '_' + i);
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
                    c = 'b-form__label_plus';
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
                    g.table.find('.b-form__b' + (i + 1)).val(aMatrix[i][j]);
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
                    aMatrix[i][j] = g.table.find('.b-form__x' + (j + 1) + '_' + (i + 1)).val();
                    }
                    else {
                    aMatrix[i][j] = g.table.find('.b-form__b' + (i + 1)).val();
                    }
                }
            }
        return aMatrix;
        }
    g.show = function(aMatrix){
        var table = g.tableEmpty.clone();
        var tr;
        var td;
        for (var i = 0; i < aMatrix.length; i++){
            tr  = g.tr.clone();
            for (var j = 0; j < aMatrix[i].length; j++){
                td  = g.td.clone();
                td.append((+aMatrix[i][j]).toFixed(3));
                tr.append(td);
                }
            table.append(tr);
            }
        tr  = g.tr.clone();
        td  = g.td.clone();
        td.append(table);
        tr.append(td);
        g.solutionTable.append(tr);
        tr  = g.tr.clone();
        g.solutionTable.append(tr.append('~'));
        }
    g.solve = function(){
        g.m = g.matrix;
        var n = g.m.length;
        g.show(g.m);
        for (var k = 0; k < n - 1; k++){
            var k1 = k;
            while (g.m[k][k] == 0){
                k1++;
                if (k1 == n) {
                    return -1;
                    }
                var r = g.m[k1];
                g.m[k1] = g.m[k];
                g.m[k] = r;
                g.nextStep('Change equations order between ' + (k + 1) + ' and ' + (k1 + 1) + ':');
                g.show(g.m);
                }
            for (var i = k + 1; i < n; i++){
                if (g.m[i][k] != 0) {
                    var m = - g.m[i][k] / g.m[k][k];
                    for (var j = k; j <= n; j++){
                        g.m[i][j] = +g.m[i][j] + g.m[k][j] * m;
                        }
                    g.nextStep('Equation ' + (i + 1) + ' added with equation ' + (k + 1) + ' multiplied by ' + m.toFixed(3) + ':');
                    g.show(g.m);
                    }
                }
            }
            //Solving x's
            g.x[n - 1] = Math.round((g.m[n - 1][n] / g.m[n - 1][n - 1]) / g.e) * g.e;
            g.showX(g.x, n - 1);
            if (n > 1) {
                for (var i = n - 2; i >= 0; i--){
                    var m = g.m[i][n];
                    for (var j = i + 1; j < n; j++){
                        m = m - g.x[j] * g.m[i][j];    
                        }
                    g.x[i] = m / g.m[i][i];
                    g.nextStep('Solving x' + (i + 1) + ': ' + m.toFixed(3) + ' divided by ' + (+g.m[i][i]).toFixed(3) + ':');
                    g.showX(g.x, i);
                    }
                }
        return 1;
        }
    g.vectorE = function(){
        var n = g.matrix.length;
        var m = g.matrix[0].length - 1;
        g.ve = [];
        for (var i = 0; i < n; i++){
            var ss = 0;
            for (var j = 0; j < m; j++){
                ss += g.matrix[i][j] * g.x[j];
                }
            g.ve[i] = ss - g.matrix[i][m];
            }
        }
    g.showX = function(x, i){
        g.nextStep('Solved x' + (i + 1) + ' = ' + Math.round((+x[i]) / g.e) * g.e);
        }
    g.nextStep = function(sMessage){
        var tr  = g.tr.clone();
        g.solutionTable.append(tr.append(sMessage));
        }
    g.solution = function() {
    g.matrix = g.getTable();
    g.solutionTable.empty();
    g.nextStep('Accuracy =  ' + g.e);
    var result = g.solve();
    switch (result) {
        case -1: 
            g.solutionText.append("Can't find solution, coefficients are 0!");
            break;
        case 1: 
            g.solutionText.append("Solution found");
            g.vectorE();
            g.nextStep('X vector: ' + g.x);
            g.nextStep('Vector of errors: ' + g.ve);
            break;
        default: 
            g.solutionText.append("Can't find solution");
        }
    }
    
    //Events
    g.button.click(g.solution);
}
b_gauss.prototype = new component();