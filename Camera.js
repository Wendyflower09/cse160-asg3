class Camera {
    constructor(){
        this.eye = new Vector(0,0,3);
        this.at = new Vector(0,0,-100);
        this.up = new Vector(0,1,0);

        this.yaw = 180;
        this.pitch = 0;

        this.sensitivity = 0.2;
        this.step = 0.2

        this.updateDirection();
    }
  
    forward(){
      let f = this.at.subtract(this.eye).normalize();
      let stepVec = f.multiply(this.step);
      this.eye = this.eye.add(stepVec);
      this.at = this.at.add(stepVec);
    }
    
    back(){
      let f = this.at.subtract(this.eye).normalize();
      let stepVec = f.multiply(this.step);
      this.eye = this.eye.subtract(stepVec);
      this.at = this.at.subtract(stepVec);
    }
    
    left(){
      let f = this.at.subtract(this.eye).normalize();
      let r = f.cross(this.up).normalize();
      let stepVec = r.multiply(this.step);
      this.eye = this.eye.subtract(stepVec);
      this.at = this.at.subtract(stepVec);
    }
    
    right(){
      let f = this.at.subtract(this.eye).normalize();
      let r = f.cross(this.up).normalize();
      let stepVec = r.multiply(this.step);
      this.eye = this.eye.add(stepVec);
      this.at = this.at.add(stepVec);
    }
    
    rotateLeft(angle = 5){
      this.yaw += angle;
      this.updateDirection();
    }
    
    rotateRight(angle = 5){
      this.yaw -= angle;
      this.updateDirection();
    }

    updateDirection(){
        let yawRad = this.yaw * Math.PI/180;
        let pitchRad = this.pitch * Math.PI/180;
        let forward = new Vector(
            Math.cos(pitchRad) * Math.sin(yawRad),
            Math.sin(pitchRad),
            Math.cos(pitchRad) * Math.cos(yawRad)
        );
        this.at = this.eye.add(forward);
    }

    handleMouseMove(dx, dy){
        this.yaw -= dx * this.sensitivity;
        this.pitch -= dy * this.sensitivity;
        if(this.pitch > 89) this.pitch = 89;
        if(this.pitch < -89) this.pitch = -89;
        this.updateDirection();
    }
}
  