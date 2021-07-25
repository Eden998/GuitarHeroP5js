class MenuButton{
  constructor(x, y, text, text_size, font, button_dest, color = [255, 255, 255]){
    this.pos = [x, y];
    this.color = color;
    this.button_dest = button_dest;
    this.text = text;
    this.text_size = text_size;
    this.font = font;
    this.text_rect = this.font.textBounds(this.text, this.pos[0], this.pos[1], this.text_size);
    this.boundary = 20;
    this.text_rect_mid_x = this.text_rect.x + this.text_rect.w / 2;
    this.text_rect_mid_y = this.text_rect.y + this.text_rect.h / 2;
    this.text_width_from_mid = this.text_rect.w / 2 + this.boundary / 2;
    this.text_height_from_mid = this.text_rect.h / 2 + this.boundary / 2;
    this.mouse_hover = false;
  }
  
  draw(){
    this.update_hover();
    stroke(this.color)
    strokeWeight(3)
    textSize(this.text_size)
    if (this.mouse_hover){
      fill(this.color)
    }
    else{
      fill(0)
    }
    rect(this.text_rect.x + this.text_rect.w / 2, this.text_rect.y + this.text_rect.h / 2, this.text_rect.w + this.boundary, this.text_rect.h + this.boundary, 20);
    fill(0)
    text(this.text, this.pos[0], this.pos[1]);
  }
  
  update_hover(){
    if(this.text_rect_mid_x - this.text_width_from_mid <= mouseX && mouseX <= this.text_rect_mid_x + this.text_width_from_mid && this.text_rect_mid_y - this.text_height_from_mid <= mouseY && mouseY <= this.text_rect_mid_y + this.text_height_from_mid){
      this.mouse_hover = true;
    }
    else{
      this.mouse_hover = false;
    }
  }
  
  is_clicked(){
    if(this.text_rect_mid_x - this.text_width_from_mid <= mouseX && mouseX <= this.text_rect_mid_x + this.text_width_from_mid && this.text_rect_mid_y - this.text_height_from_mid <= mouseY && mouseY <= this.text_rect_mid_y + this.text_height_from_mid){
      return this.button_dest;
    }
    return null;
  }
}