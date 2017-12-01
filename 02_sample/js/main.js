// DOM読み込み後に処理開始
window.addEventListener('DOMContentLoaded', main);
function main() {
  // 宣言
  var elCanvas = document.getElementById('canvas');
  var targetRotation = 0;
  var time = Date.now();

  // シーン
  var scene, world;
  function initScene() {
    // ワールド生成
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // 重力を設定
    world.broadphase = new CANNON.NaiveBroadphase(); // ぶつかっている可能性のあるオブジェクト同士を見つける
    world.solver.iterations = 8;// 反復計算回数
    world.solver.tolerance = 0.1;

    // シーン作成
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
  }

  // カメラ
  var camera, controller;
  function initCamera() {
    fov = 70, // 画角
    aspect = elCanvas.clientWidth / elCanvas.clientHeight, // アスペクト比
    near = 1, // この値より手前は描画されない 
    far = 1000, // この値より奥は描画されない
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 150, 500);

    var mass = 5, radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0,5,0);
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);
    controls = new PointerLockControls(camera, sphereBody);
    scene.add(controls.getObject());

    var pointerlockchange = function(event) {
      if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
          controls.enabled = true;
      } else {
          controls.enabled = false;
      }
    }
    document.addEventListener('pointerlockchange', pointerlockchange);
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

  // 床
  var plane, phyPlane;
  function initPlane() {
    // cannonで床を生成
    var planeMass = 0; // 質量を0にすると衝突しても動かない                                                           
    var planeShape = new CANNON.Plane();
    phyPlane = new CANNON.Body({mass: planeMass, shape: planeShape});
    phyPlane.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // X軸に90度回転  
    phyPlane.position.set(0, 0, 0);
    world.addBody(phyPlane);

    // threeで床を生成
    var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xdddddd});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
  }

  // 箱
  var box, phyBox;
  function initBox() {
    var boxMass = 1; // 箱の質量
    var boxShape = new CANNON.Box(new CANNON.Vec3(5, 5, 5)); // 箱の形状
    var phyBox = new CANNON.Body({mass: boxMass, shape: boxShape}); // 箱作成
    phyBox.position.set(0, 20, 0); // 箱の位置
    phyBox.angularVelocity.set(0.1, 0.1, 0.1); // 角速度
    phyBox.angularDamping = 0.1; // 減衰率
    world.addBody(phyBox);

    var boxGeometry = new THREE.BoxGeometry(100, 100, 100);
    var boxMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);
  }

  // 描画
  function renderLoop() {
    requestAnimationFrame(renderLoop);

    world.step(1 / 60);

    plane.position.copy(phyPlane.position);
    plane.quaternion.copy(phyPlane.quaternion);

    // if (controls.enabled) {
    //   world.step(1 / 60);
      
    //   plane.position.copy(phyPlane.position);
    //   plane.quaternion.copy(phyPlane.quaternion);

    //   // // Update ball positions
    //   // for (var i=0; i<balls.length; i++) {
    //   //     ballMeshes[i].position.copy(balls[i].position);
    //   //     ballMeshes[i].quaternion.copy(balls[i].quaternion);
    //   // }
    // }

    // controls.update(Date.now() - time);
    // time = Date.now();

    renderer.render(scene, camera);
  }

  // スタート
  (function() {
    initScene();
    initCamera();
    initRenderer();
    initLight();
    initPlane();
    initBox();
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