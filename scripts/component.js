function component()
{
this.elem = null;

this.init = function(sSelector){
		this.elem		= $(sSelector);

		if (!this.elem.length)			// ���� ��� ����� (���-��) ��������� ���������
		{
		alert("Can't find element by selector " + sSelector);
		}
	}
this.find = function(sSelector){
	return this.elem.find(sSelector);
	}
}