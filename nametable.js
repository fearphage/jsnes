function NameTable(width, height, name) {	
	this.name = name;
	
	this.tile = new Array(width*height);
	this.attrib = new Array(width*height);
	
	this.width = width;
	this.height = height;
}

NameTable.prototype.getTileIndex = function(x, y){
	return this.tile[y*this.width+x];
}

NameTable.prototype.getAttrib = function(x, y){
	return this.attrib[y*this.width+x];
}

NameTable.prototype.writeAttrib = function(index, value){
	var basex = (index%8) *4, basey = parseInt(index/8) *4
      ,add,tx,ty,attindex;
	
	for(var sqy=0;sqy<2;sqy++){
		for(var sqx=0;sqx<2;sqx++){
			add = (value>>(2*(sqy*2+sqx)))&3;
			for(var y=0;y<2;y++){
				for(var x=0;x<2;x++){
					tx = basex+sqx*2+x;
					ty = basey+sqy*2+y;
					attindex = ty*this.width+tx;
					this.attrib[ty*this.width+tx] = (add<<2)&12;
					////System.out.println("x="+tx+" y="+ty+" value="+attrib[ty*width+tx]+" index="+attindex);
				}
			}
		}
	}
}