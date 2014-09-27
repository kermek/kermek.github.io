function component()
{
this.elem = null;

this.init = function(sSelector){
		this.elem		= $(sSelector);

		if (!this.elem.length)			// если нет длины (кол-ва) найденных элементов
		{
		alert("Can't find element by selector " + sSelector);
		}
	}
this.find = function(sSelector){
	return this.elem.find(sSelector);
	}
}