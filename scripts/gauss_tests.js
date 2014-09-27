/*
QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});
*/
QUnit.test("gauss_solver.solve", function (assert) {
    var g = new b_gauss__solver();
    var t = {};
    
    t.happy               = [
								 ['   3', ' 2', ' 1', ' 1', '-2']
								,['   1', '-1', ' 4', '-1', '-1']
								,['  -2', '-2', '-3', ' 1', ' 9']
								,['   1', ' 5', '-1', ' 2', ' 4']
							];
    t.happyExpected       = [-3, -1, 2, 7];
    t.unhappy             = [
								 ['   3', ' 2', ' 1', ' 1', '-2']
								,['   -3', '-2', ' -1', '-1', '2']
								,['  -2', '-2', '-3', ' 1', ' 9']
								,['   1', ' 5', '-1', ' 2', ' 4']
							];
    t.unhappyExpected     = [];
	
	t.getFractions		  = function(aArray){
		for (var i = 0; i < aArray.length; i++){
			for (var j = 0; j < aArray[i].length; j++){
				aArray[i][j] = new Fraction(+aArray[i][j]);
				}
			}
		return aArray;
		}
	t.toString			  = function(aArray){
		var a = [];
		for (var i = 0; i < aArray.length; i++){
			a[i] = new Fraction(+aArray[i]).toString();
			}
		return a;
		}
    
    t.happy = t.getFractions(t.happy);
    assert.deepEqual(g.solve(t.happy).toString(), t.toString(t.happyExpected), 'Happy path: system of equations is consistent and being solved.');
    t.unhappy = t.getFractions(t.unhappy);
    assert.deepEqual(g.solve(t.unhappy).toString(), t.toString(t.unhappyExpected), 'Unhappy path: system of equations is inconsistent.');
});