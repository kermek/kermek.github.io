function b_gauss__solver()
{
var g = this;

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
            str += sign + value + 'x_' + (j + 1);
        }
    return str;
    }
g.getRightPartFromRow = function(aMatrix, iRow){
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
g.showVector = function(aVector, sStyle){
    var s =  '$$\\begin{' + sStyle + '}';
        s += aVector.join('\\\\');
        s += '\\end{' + sStyle + '}$$';
    return s;
    }
g.showFrac = function(oFraction){
    return '\\frac{' + oFraction.numerator + '}{' + oFraction.denominator + '}';
    }
g.solve = function(aMatrix){
    g.m = aMatrix;
	g.x = [];
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
                return g;
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
			g.solutionSteps.push(g.showSystem(aSystem, true));
			var isAllXsZeros = new Fraction(0);
			for (var z = 0; z < n; z++) {
				isAllXsZeros = isAllXsZeros.add(g.m[i][z]);
				}
			console.log(isAllXsZeros.toString())
			if (isAllXsZeros.numerator == 0) {
				g.solutionSteps.push(g.showSystem(g.setSystem(g.m), false));
				return g;
				}
            }
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
    return g;
    }
g.toString = function(){
	var a = [];
	for (var i = 0; i < g.x.length; i++){
		a[i] = g.x[i].toString();
		}
	return a;
	}
g.vectorE = function(aMatrix, oVectorX){
    var n = aMatrix.length;
    var m = aMatrix[0].length - 1;
    var v = [];
	var result = {};
	result.show=[];
	
    for (var i = 0; i < n; i++){
        var ss = new Fraction(0);
        for (var j = 0; j < m; j++){
            ss = ss.add(aMatrix[i][j].multiply(oVectorX[j]));
            }
        v[i] = ss.subtract(aMatrix[i][m]);
        }
	result.vectorE	= v;
	var a = new Array(v.length);
	a[v.length/2] = settings.get('vector_x');
	result.show[0]	= g.showVector(a, 'array');
	result.show[1]	= g.showVector(oVectorX, 'pmatrix'); 
	a[v.length/2] = settings.get('vector_e');
	result.show[2]	= g.showVector(a, 'array');
	result.show[3] 	= g.showVector(result.vectorE, 'pmatrix'); 
	return result;
    }
}