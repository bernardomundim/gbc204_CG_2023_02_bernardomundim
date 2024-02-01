
var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 0;

var bufferId;

function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW );



    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
        document.getElementById("slider").onchange = function(event) {
        numTimesToSubdivide = event.target.value;
        render();
    };


    render();
};

function divideLinha( a, b, count )
{

    // check for end of recursion
    
    if ( count == 0 ) {
        points.push( a, b );
    }
    else {
    
        //bisect the sides
        
        var amid = mix( a, b, 0.333 );
        var bmid = mix( a, b, 0.666 );
        var mid = mix(a, b, 0.5);
        mid = mid*ab;

        --count;

        // three new triangles
        
        divideLinha( a,amid, count );
        divideLinha( amid,mid, count );
        divideLinha( mid, bmid, count );
        divideLinha( bmid, b, count );
    }
}

window.onload = init;

function render()
{
    var vertices = [
        vec2( -1, 0 ),
        vec2(  1, 0 )
    ];
    points = [];
    divideLinha( vertices[0], vertices[1],
                    numTimesToSubdivide);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
    points = [];
    //requestAnimFrame(render);
}

