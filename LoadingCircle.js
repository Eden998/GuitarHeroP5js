class LoadingCircle{
    constructor(x, y, color, size){
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = size;
      this.min_size = 6;
      this.max_size = 120;
      this.change = 2;
      this.increase = true;
    }
    
    draw(){
      stroke(this.color);
      fill(this.color);
      circle(this.x, this.y, this.size);
    }
    
    update_size(){
      if (this.increase){
        this.size += this.change;
      }
      else{
        this.size -= this.change;
      }
      if (this.size >= this.max_size){
        this.increase = false;
      }
      else if(this.size <= this.min_size){
        this.increase = true;
      }
    }
  }