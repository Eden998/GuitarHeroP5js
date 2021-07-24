class Button{
  constructor(button_x, button_y, button_color, button_key, button_radius){
    this.button_x = button_x;
    this.button_y = button_y;
    this.button_color = button_color;
    this.button_key = button_key;
    this.button_radius = button_radius;
    this.sparkles_on_hit = 6;
    this.sparkles = []
  }
  
  draw(){
    this.remove_sparkles();
    textSize(30)
    strokeWeight(5);
    fill(0, 0, 0, 200);
    stroke(this.button_color);
    circle(this.button_x, this.button_y, this.button_radius);
    stroke(255, 255, 255, 100);
    text(this.button_key, this.button_x, this.button_y + 10);
    for (let i = 0 ; i < this.sparkles.length ; i++){
      this.sparkles[i].draw();
    }
  }
  
  get_pos_x(){
    return this.button_x;
  }
  
  note_hit(multiplayer){
    for (let i = 0; i < this.sparkles_on_hit * multiplayer; i++){
      let sparkle = new Sparkle(this.button_x, this.button_y, this.button_color);
      this.sparkles.push(sparkle);
    }
  }
  
  remove_sparkles(){
    for(let i = 0 ; i < this.sparkles.length ; i++){
      if (this.sparkles[i].get_pos_y() > screen_size[1] || this.sparkles[i] <= 0)
        this.sparkles.splice(i, 1);
    }
  }
}