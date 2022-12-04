  const VELOCITY = 9; // минут на кадр

  const sunPosAt = dt => {
    const day = new Date(+dt).setUTCHours(0, 0, 0, 0);
    const t = solar.century(dt);
    const longitude = (day - dt) / 864e5 * 360 - 180;
    return [longitude - solar.equationOfTime(t) / 4, solar.declination(t)];
  };

  let dt = +new Date();
  const solarTile = { pos: sunPosAt(dt) };
  const timeEl = document.getElementById('time');

  const Globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .tilesData([solarTile])
    .tileLng(d => d.pos[0])
    .tileLat(d => d.pos[1])
    .tileAltitude(0.005)
    .tileWidth(180)
    .tileHeight(180)
    .tileUseGlobeProjection(false)
    .tileMaterial(() => new THREE.MeshLambertMaterial({ color: '#ffff00', opacity: 0.3, transparent: true }))
    .tilesTransitionDuration(0);

  // анимация солнечного дня
  requestAnimationFrame(() =>
    (function animate() {
      dt += VELOCITY * 60 * 1000;
      solarTile.pos = sunPosAt(dt);
      Globe.tilesData([solarTile]);
      timeEl.textContent = new Date(dt).toLocaleString();
      requestAnimationFrame(animate);
    })()
  );

  // рендер
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('globeViz').appendChild(renderer.domElement);

  // создание сцены
  const scene = new THREE.Scene();
  scene.add(Globe);
  scene.add(new THREE.AmbientLight(0xbbbbbb));
  scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

  // установка камеры
  const camera = new THREE.PerspectiveCamera();
  camera.aspect = window.innerWidth/ window.innerHeight;
  camera.updateProjectionMatrix();
  camera.position.z = 500;

  // контроль камеры
  const tbControls = new THREE.TrackballControls(camera, renderer.domElement);
  tbControls.minDistance = 101;
  tbControls.rotateSpeed = 5;
  tbControls.zoomSpeed = 0.8;

  // Средство визуализации начала работы
  (function animate() { // IIFE
    // Цикл кадров
    tbControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();