function Tile() {
	// Tile data:
	this.pix = new Array(64);
	
	this.fbIndex = null;
	this.tIndex = null;
	this.w = null;
	this.h = null;
	this.incX = null;
	this.incY = null;
	this.palIndex = null;
	this.tpri = null;
	this.c = null;
	this.initialized = false;
	this.opaque = new Array(8);
}
	
Tile.prototype.setBuffer = function(scanline){
	for (var y=0;y<8;y++) {
		this.setScanline(y, scanline[y], scanline[y+8]);
	}
}
	
Tile.prototype.setScanline = function(sline, b1, b2){
	this.initialized = true;
	var x = 0, tIndex = this.tIndex = sline<<3;
	for( ;x<8;x++){
		this.pix[tIndex+x] = ((b1>>(7-x))&1) 
		        + (((b2>>(7-x))&1)<<1);
		if(this.pix[tIndex+x]==0) this.opaque[sline]=false;
	}
}
	
	
Tile.prototype.render = function(srcx1, srcy1, srcx2, srcy2, dx, dy, palAdd, palette, flipHorizontal, flipVertical, pri, priTable){

	if(dx<-7 || dx>=256 || dy<-7 || dy>=240){
		return;
	}

	this.w=srcx2-srcx1;
	this.h=srcy2-srcy1;
	
	if(dx<0){
		srcx1-=dx;
	}
	if(dx+srcx2>=256){
		srcx2=256-dx;
	}
	
	if(dy<0){
		srcy1-=dy;
	}
	if(dy+srcy2>=240){
		srcy2=240-dy;
	}
	var y = 0, x = 0;
	if(!flipHorizontal && !flipVertical){
		
		this.fbIndex = (dy<<8)+dx;
		this.tIndex = 0;
		for( ;y<8;y++){
			for( ;x<8;x++){
				if(x>=srcx1 && x<srcx2 && y>=srcy1 && y<srcy2){
					this.palIndex = this.pix[this.tIndex];
					this.tpri = priTable[this.fbIndex];
					if(this.palIndex!=0 && pri<=(this.tpri&0xFF)){
					    //console.log("Rendering upright tile to buffer");
						Globals.nes.ppu.buffer[this.fbIndex] = palette[this.palIndex+palAdd];
						this.tpri = (this.tpri&0xF00)|pri;
						priTable[this.fbIndex] =this.tpri;
					}
				}
				this.fbIndex++;
				this.tIndex++;
			}
			this.fbIndex-=8;
			this.fbIndex+=256;
		}
		
	}else if(flipHorizontal && !flipVertical){
		
		this.fbIndex = (dy<<8)+dx;
		this.tIndex = 7;
		for( ;y<8;y++){
			for( ;x<8;x++){
				if(x>=srcx1 && x<srcx2 && y>=srcy1 && y<srcy2){
					this.palIndex = this.pix[this.tIndex];
					this.tpri = priTable[this.fbIndex];
					if(this.palIndex!=0 && pri<=(this.tpri&0xFF)){
						Globals.nes.ppu.buffer[this.fbIndex] = palette[this.palIndex+palAdd];
						this.tpri = (this.tpri&0xF00)|pri;
						priTable[this.fbIndex] =this.tpri;
					}
				}
				this.fbIndex++;
				this.tIndex--;
			}
			this.fbIndex-=8;
			this.fbIndex+=256;
			this.tIndex+=16;
		}
		
	}else if(flipVertical && !flipHorizontal){
		
		this.fbIndex = (dy<<8)+dx;
		this.tIndex = 56;
		for( ;y<8;y++){
			for( ;x<8;x++){
				if(x>=srcx1 && x<srcx2 && y>=srcy1 && y<srcy2){
					this.palIndex = this.pix[this.tIndex];
					this.tpri = priTable[this.fbIndex];
					if(this.palIndex!=0 && pri<=(this.tpri&0xFF)){
						Globals.nes.ppu.buffer[this.fbIndex] = palette[this.palIndex+palAdd];
						this.tpri = (this.tpri&0xF00)|pri;
						priTable[this.fbIndex] =this.tpri;
					}
				}
				this.fbIndex++;
				this.tIndex++;
			}
			this.fbIndex-=8;
			this.fbIndex+=256;
			this.tIndex-=16;
		}
		
	}else{
		
		this.fbIndex = (dy<<8)+dx;
		this.tIndex = 63;
		for( ;y<8;y++){
			for( ;x<8;x++){
				if(x>=srcx1 && x<srcx2 && y>=srcy1 && y<srcy2){
					this.palIndex = this.pix[this.tIndex];
					this.tpri = priTable[this.fbIndex];
					if(this.palIndex!=0 && pri<=(this.tpri&0xFF)){
					    Globals.nes.ppu.buffer[this.fbIndex] = palette[this.palIndex+palAdd];
						this.tpri = (this.tpri&0xF00)|pri;
						priTable[this.fbIndex] =this.tpri;
					}
				}
				this.fbIndex++;
				this.tIndex--;
			}
			this.fbIndex-=8;
			this.fbIndex+=256;
		}
		
	}
	
}
	
Tile.prototype.isTransparent = function(x, y){
	return (this.pix[(y<<3)+x]==0);
}
