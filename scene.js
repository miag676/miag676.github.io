var container, stats;

var camera, scene, renderer;

var group, text, plane;

var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var finalRotationY

init();
animate();


function load_texture_mat(path) {
    
        // texture - texture must not be in same folder or there is an error.
        var texture = THREE.ImageUtils.loadTexture( path, {}, function(){ 
        // use to test when image gets loaded if it does
        render();
        }, 
        function(){ 
            alert('error loading texture') 
        });
        
        return new THREE.MeshPhongMaterial({map: texture});
}

function load_fresnel_mat(cubePath) {
    
        var path = cubePath;
        var format = '.jpg';
        var urls = [
                        path + 'px' + format, path + 'nx' + format,
                        path + 'py' + format, path + 'ny' + format,
                        path + 'pz' + format, path + 'nz' + format
                ];


        var textureCube = THREE.ImageUtils.loadTextureCube( urls );
        textureCube.format = THREE.RGBFormat;

        var shader = THREE.FresnelShader;
        var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

        uniforms[ "tCube" ].value = textureCube;

        var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms };
        return new THREE.ShaderMaterial( parameters );
}



function init() {
    
    

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
        camera.position.z = 5;

        scene = new THREE.Scene();

        // lights

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );

//        load material with loaded texture
        material = load_texture_mat('images/texture.jpg');

        group = new THREE.Object3D();
         
        //load mesh 
        var loader = new THREE.JSONLoader();
        loader.load('models/cube.js', modelLoadedCallback);


        // renderer

        renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );

        container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );

        //

        window.addEventListener( 'resize', onWindowResize, false );
        
        //for debuging stats
        interval = setInterval( debugInfo, 50 );

}

function modelLoadedCallback(geometry) {

        mesh = new THREE.Mesh( geometry, material );
        group.add(mesh);
        scene.add( group );

}

function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseDown( event ) {
        console.log("mousedown")
        event.preventDefault();

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'mouseout', onDocumentMouseOut, false );

        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;
        
        mouseYOnMouseDown = event.clientY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;

}

function onDocumentMouseMove( event ) {
        console.log("mousemove")
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;


        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;



}

function onDocumentMouseUp( event ) {
        console.log("mouseup")
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseOut( event ) {
        console.log("mouseout")
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentTouchStart( event ) {
        console.log("touchstart")
        if ( event.touches.length == 1 ) {

                event.preventDefault();

                mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
                targetRotationOnMouseDownX = targetRotationX;
                
                mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
                targetRotationOnMouseDownY = targetRotationY;
                
                

        }

}

function onDocumentTouchMove( event ) {
        console.log("")
        if ( event.touches.length == 1 ) {

                event.preventDefault();

                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;
                
                mouseY = event.touches[ 0 ].pageY - windowHalfY;
                targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;

        }

}

//

function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();

}

function render() {
        
     //horizontal rotation   
     group.rotation.y += ( targetRotationX - group.rotation.y ) * 0.1;
        
     //vertical rotation 
     finalRotationY = (targetRotationY - group.rotation.x); 

    if (group.rotation.x <= 1 && group.rotation.x >= -1) {

        group.rotation.x += finalRotationY * 0.1;
    }
    if (group.rotation.x > 1) {

        group.rotation.x = 1
    }
    else if (group.rotation.x < -1) {

        group.rotation.x = -1
    }

        
        renderer.render( scene, camera );

}


function debugInfo()
{
    $('#debug').html("mouseX : " + mouseX + "   mouseY : " + mouseY + "</br>")
   
}