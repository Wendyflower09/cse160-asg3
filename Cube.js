//Xiaohua Huo
//xhuo3@ucsc.edu
//Thank you!

class Cube{
    constructor(){
        this.type = "cube";
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = -2;

        this.deletable = false;
    }

    render(){
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);

        // pass color
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // pass matrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // top of cube
        drawTriangle3DUV(
            [0.0, 1.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0],
            [0, 0,   1, 0,   1, 1]
          );
          drawTriangle3DUV(
            [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0],
            [0, 0,   1, 1,   0, 1]
          );
      
          drawTriangle3DUV(
            [0.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 1.0],
            [0, 0,   1, 0,   1, 1]
          );
          drawTriangle3DUV(
            [0.0, 0.0, 0.0,   1.0, 0.0, 1.0,   0.0, 0.0, 1.0],
            [0, 0,   1, 1,   0, 1]
          );
      
          drawTriangle3DUV(
            [0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0],
            [1, 0,   0, 1,   0, 0]
          );
          drawTriangle3DUV(
            [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0],
            [1, 0,   1, 1,   0, 1]
          );
      
          drawTriangle3DUV(
            [0.0, 0.0, 1.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0],
            [0, 0,   1, 0,   1, 1]
          );
          drawTriangle3DUV(
            [0.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0],
            [0, 0,   1, 1,   0, 1]
          );
      
          drawTriangle3DUV(
            [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, 1.0],
            [0, 0,   0, 1,   1, 0]
          );
          drawTriangle3DUV(
            [0.0, 1.0, 0.0,   0.0, 0.0, 1.0,   0.0, 1.0, 1.0],
            [0, 1,   1, 0,   1, 1]
          );

          drawTriangle3DUV(
            [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0],
            [1, 0,   1, 1,   0, 1]
          );
          drawTriangle3DUV(
            [1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0],
            [1, 0,   0, 1,   0, 0]
          );
    }
    renderFast(){
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        const allverts = [
          // --- top of cube (y = 1) ---
          0.0,1.0,0.0,   1.0,1.0,0.0,   1.0,1.0,1.0,
          0.0,1.0,0.0,   1.0,1.0,1.0,   0.0,1.0,1.0,
    
          // --- bottom of cube (y = 0) ---
          0.0,0.0,0.0,   1.0,0.0,0.0,   1.0,0.0,1.0,
          0.0,0.0,0.0,   1.0,0.0,1.0,   0.0,0.0,1.0,
    
          // --- front of cube (z = 0) ---
          0.0,0.0,0.0,   1.0,1.0,0.0,   1.0,0.0,0.0,
          0.0,0.0,0.0,   0.0,1.0,0.0,   1.0,1.0,0.0,
    
          // --- back of cube (z = 1) ---
          0.0,0.0,1.0,   1.0,0.0,1.0,   1.0,1.0,1.0,
          0.0,0.0,1.0,   1.0,1.0,1.0,   0.0,1.0,1.0,
    
          // --- left of cube (x = 0) ---
          0.0,0.0,0.0,   0.0,1.0,0.0,   0.0,0.0,1.0,
          0.0,1.0,0.0,   0.0,0.0,1.0,   0.0,1.0,1.0,
    
          // --- right of cube (x = 1) ---
          1.0,0.0,0.0,   1.0,1.0,0.0,   1.0,1.0,1.0,
          1.0,0.0,0.0,   1.0,1.0,1.0,   1.0,0.0,1.0
        ];
    
        const alluv = [
          // --- top (y=1) ---
          0,0,  1,0,  1,1,
          0,0,  1,1,  0,1,
    
          // --- bottom (y=0) ---
          0,0,  1,0,  1,1,
          0,0,  1,1,  0,1,
    
          // --- front (z=0) ---
          1,0,  0,1,  0,0,
          1,0,  1,1,  0,1,
    
          // --- back (z=1) ---
          0,0,  1,0,  1,1,
          0,0,  1,1,  0,1,
    
          // --- left (x=0) ---
          0,0,  0,1,  1,0,
          0,1,  1,0,  1,1,
    
          // --- right (x=1) ---
          1,0,  1,1,  0,1,
          1,0,  0,1,  0,0
        ];
    
        drawTriangle3DUVArray(allverts, alluv);
    }
    
}