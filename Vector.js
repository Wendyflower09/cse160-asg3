class Vector {
    constructor(x, y, z){
      this.x = x;
      this.y = y;
      this.z = z;
    }

    add(other){
      return new Vector(
        this.x + other.x,
        this.y + other.y,
        this.z + other.z
      );
    }

    subtract(other){
      return new Vector(
        this.x - other.x,
        this.y - other.y,
        this.z - other.z
      );
    }

    multiply(scalar){
      return new Vector(
        this.x * scalar,
        this.y * scalar,
        this.z * scalar
      );
    }

    divide(scalar) {
        if (scalar === 0) {
          throw new Error("Division by zero in Vector.divide()");
        }
        return new Vector(
          this.x / scalar,
          this.y / scalar,
          this.z / scalar
        );
    }

    length(){
      return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }

    dot(other){
      return this.x*other.x + this.y*other.y + this.z*other.z;
    }

    cross(other){
      return new Vector(
        this.y*other.z - this.z*other.y,
        this.z*other.x - this.x*other.z,
        this.x*other.y - this.y*other.x
      );
    }

    normalize(){
      let len = this.length();
      if (len > 0){
        return new Vector(
          this.x/len,
          this.y/len,
          this.z/len
        );
      }
      return new Vector(0,0,0);
    }
  }
  