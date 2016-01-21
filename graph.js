var canvas = document.getElementById("graph");
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth-50;
canvas.height= window.innerHeight-50; //account for default padding/margin

var graph = function( mcanvas ){
  this.offsetX = mcanvas.width / 2;
  this.offsetY = mcanvas.height / 2; //center of canvas
  this.width = mcanvas.width;
  this.height = mcanvas.height;
  this.step = .05; //interval for evaluating function
  this.min = -10;  //minimum display value
  this.max = 10;   //maxmimum display value
  this.plots = ['x^2'];
  this.range = this.max - this.min;
  this.scaleX = canvas.width / this.range; //ratio of pixels to mathematical units
  this.scaleY = canvas.width / this.range; //technically wrong but it makes the graph look ok
  this.dragging = false; //for event listeners

  mcanvas.addEventListener("mousedown", function(){
    this.dragging = true;
  });
  mcanvas.addEventListener("mouseup", function(){
    this.dragging = false;
  });
  mcanvas.addEventListener("wheel", function(event){
    event.preventDefault();
    g.offsetX -= event.deltaX;
    g.offsetY += event.deltaY;
    g.render(); //default
  });
  mcanvas.addEventListener("mousemove", function(event){
    if( this.dragging ){
      g.offsetX += event.movementX;
      g.offsetY -= event.movementY;
      g.render();
    }
  });

  //used to java, sorry
  this.addPlot = function( expr ){
    this.plots.push( expr );
  };
  this.getPlots = function(){
    return this.plots;
  };
  this.removePlot = function( index ){
    this.plots.splice( index, 1 );
  };

  this.render = function(){
    this.clear();
    this.drawGrid();
    for(var i = 0; i < this.plots.length; i++){
      ctx.lineWidth = 1;
      var variables = {
        'x': this.min
      };
      if(!this.plots[i]){
        return;
      }
      var initX = this.scaleX * this.min + this.offsetX;
      var initY = mcanvas.height - this.scaleY * evalFunction(this.plots[i], variables) - this.offsetY;
      ctx.moveTo( initX, initY );
      for(var j = this.min; j <= this.max; j += this.step){
        ctx.strokeStyle="black";
        ctx.lineWidth = "2";
        variables.x = j;
        var y = evalFunction( this.plots[i], variables );
        var canvasX =                  this.scaleX * j + this.offsetX;
        var canvasY = canvas.height - (this.scaleY * y + this.offsetY);
        ctx.lineTo( canvasX, canvasY );
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo( canvasX, canvasY );
      }
    }
  };
  
  this.drawGrid = function(){
    ctx.lineWidth = 1;
    ctx.moveTo( 0, this.offsetY );
    //horizontal lines
    for(var i = 0; i <= this.height; i++){
      ctx.beginPath();
      ctx.moveTo( 0,           this.height - this.scaleY * i - this.offsetY);
      ctx.lineTo( this.width,  this.height - this.scaleY * i - this.offsetY);
      ctx.moveTo( 0,           this.height + this.scaleY * i - this.offsetY);
      ctx.lineTo( this.width,  this.height + this.scaleY * i - this.offsetY);
      ctx.strokeStyle = "grey";
      ctx.stroke();
    }
    //vertical lines
    for(var i = 0; i <= this.height; i++){
      ctx.beginPath();
      ctx.moveTo( this.offsetX - this.scaleX * i, 0 );
      ctx.lineTo( this.offsetX - this.scaleX * i, this.height)
      ctx.moveTo( this.offsetX + this.scaleX * i, 0 );
      ctx.lineTo( this.offsetX + this.scaleX * i, this.height );
      ctx.strokeStyle = "grey";
      ctx.stroke();
    }
  };
  this.clear = function(){
    ctx.clearRect(0,0,this.width,this.height);
    this.drawGrid();
  };
};
