class Sparkle{
  constructor(x, y, color){
    this.pos = createVector(x, y);
    this.vel = createVector(random(-3, 3), random(-3, 3));
    this.color = color;
    this.alpha = random(0, 255);
    this.radius = random(4, 8);
    this.gravity = createVector(0, 0.1);
  }
  
  draw(){
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    strokeWeight(0);
    circle(this.pos.x, this.pos.y, this.radius);
    this.pos.add(this.vel);
    this.vel.add(this.gravity);
    //this.alpha -= 3;
  }
  
  get_pos_y(){
    return this.pos.y;
  }
}