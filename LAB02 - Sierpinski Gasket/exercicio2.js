
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
        
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW );


    
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
    
    if ( count == 0 ) {
        points.push( a, b );
    }
    else {

        //Acha os pontos 1/3 e 2/3 da reta
        var amid = mix( a, b, 0.333 );
        var bmid = mix( a, b, 0.666 );
        // Calcula a distancia de AB
        var distanciaAB = Math.sqrt(Math.pow((b[0] - a[0]), 2) + Math.pow((b[1] - a[1]), 2));
        // ponto medio x
        var xm = (a[0] + b[0]) / 2;
        // ponto medio y
        var ym = (a[1] + b[1]) / 2;
        //Calculo do vetor AB
        var abx = b[0] - a[0];
        var aby = b[1] - a[1];  
        // Usa do veotr AB para calcular o seu unitario
        var magnitudeAB = Math.sqrt(abx * abx + aby * aby);
        var ux = abx / magnitudeAB;
        var uy = aby / magnitudeAB;
        // com o vetor unitario acha o ponto que e perpendicular a reta(necessario pois a reta n sera sempre perpendicular ao eixo y)
        var vx = -uy;
        var vy = ux;
        // distancia que o ponto c estara da reta
        var d = distanciaAB / 3;
        //a partir do ponto medio, soma a distancia vezes a inclinacao para achar o ponto c
        var xc = xm + d * vx;
        var yc = ym + d * vy;
        //guarda os valores do ponto C 
        var mid = vec2(xc,yc);

        --count;

        // faz de A para o ponto 1/3, ponto 1/3 ate C
        //ponto C ate 2/3 e por fim 2/3 ate B, repetindo o processo recursivamente
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

