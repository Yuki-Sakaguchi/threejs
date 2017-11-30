// DOM読み込み後に処理開始
window.addEventListener('DOMContentLoaded', main);
function main() {
  // 宣言
  var elCanvas = document.getElementById('canvas');
  var targetRotation = 0;

  // シーン
  var scene  = new THREE.Scene();
  function initScene() {
    scene.background = new THREE.Color(0xf0f0f0);
  }

  // カメラ
  var camera;
  function initCamera() {
    fov = 70, // 画角
    aspect = elCanvas.clientWidth / elCanvas.clientHeight, // アスペクト比
    near = 1, // この値より手前は描画されない 
    far = 1000, // この値より奥は描画されない
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 150, 500);
  }

  // レンダリング
  var renderer;
  function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    elCanvas.appendChild(renderer.domElement);
  }

  // 光源
  var directionalLight;
  function initLight() {
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0.7, 0.7);
    scene.add(directionalLight);
  }

  // 物体
  var cube;
  function initCube() {
    var geometry = new THREE.BoxGeometry(200, 200, 200);

    for (var i = 0; i < geometry.faces.length; i += 2) {
      var hex = Math.random() * 0xffffff;
      geometry.faces[i].color.setHex(hex);
      geometry.faces[i + 1].color.setHex(hex);
    }

    var material = new THREE.MeshPhongMaterial({
      vertexColors: THREE.FaceColors,
      overdraw: 0.5
    });

    cube = new THREE.Mesh(geometry, material);
    cube.position.y = 150;
    scene.add(cube);
  }

  // 影
  var plane;
  function initPlane() {
    var geometry = new THREE.PlaneBufferGeometry(200, 200);
    geometry.rotateX(-Math.PI / 2);

    var metarial = new THREE.MeshBasicMaterial({
      color: 0xe0e0e0,
      overdraw: 0.5
    });

    plane = new THREE.Mesh(geometry, metarial);
    scene.add(plane);
  }

  // 描画
  function renderLoop() {
    requestAnimationFrame(renderLoop);
    plane.rotation.y = cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  // スタート
  (function() {
    initScene();
    initCamera();
    initRenderer();
    initLight();
    initCube();
    initPlane();
    init();
    renderLoop();
  })();

  // リサイズ
  var handleResize = (function() {
    var resizeTimer = 0;
    return function() {
      if (resizeTimer > 0) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(function() {
         // リサイズ完了時に一度だけ動く
        init();
      }, 100);
    }
  })();
  window.addEventListener('resize', handleResize);

  // 初期化処理
  function init() {
    // レンダラー更新
    renderer.setSize(elCanvas.clientWidth, elCanvas.clientHeight);
    renderer.render(scene, camera);
    
    // カメラ更新
    camera.aspect = elCanvas.clientWidth / elCanvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}