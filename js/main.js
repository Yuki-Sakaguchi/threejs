// DOM読み込み後に処理開始
window.addEventListener('DOMContentLoaded', main);
function main() {
  // シーン
  var canvas = document.getElementById('canvas');
  var scene  = new THREE.Scene();

  // カメラ
  var camera;
  function initCamera() {
    fov = 60,
    aspect = canvas.clientWidth / canvas.clientHeight,
    near = 1,
    far = 1000,
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 50);
  }

  //レンダリング
  var renderer;
  function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    canvas.appendChild(renderer.domElement);
  }

  //光源
  var directionalLight;
  function initLight() {
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0.7, 0.7);
    scene.add(directionalLight);
  }

  //物体
  var geometry;
  function initGeometry() {
    geometry= new THREE.CubeGeometry(10, 10, 10),
    material = new THREE.MeshPhongMaterial({color: 0xff0000}),
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  // 描画
  function renderLoop() {
    requestAnimationFrame(renderLoop);
    mesh.rotation.set(0, mesh.rotation.y + 0.01, mesh.rotation.x + 0.01);
    renderer.render(scene, camera);
  }

  // スタート
  (function() {
    initCamera();
    initRenderer();
    initLight();
    initGeometry();
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
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.render(scene, camera);
    
    // カメラ更新
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}