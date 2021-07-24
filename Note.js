class Note{
  constructor(color, pos, note_radius, note_vel){
    this.color = color;
    this.pos_x = pos;
    this.pos_y = -50
    this.vel = note_vel;
    this.note_radius = note_radius
  }
  
  draw(){
    stroke(255, 255, 255, 150)
    strokeWeight(5)
    fill(this.color)
    circle(this.pos_x, this.pos_y, this.note_radius)
  }
  
  update(){
    this.pos_y += this.vel;
  }
  
  get_pos_x(){
    return this.pos_x;
  }
  
  get_pos_y(){
    return this.pos_y;
  }
}