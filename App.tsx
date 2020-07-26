import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import * as React from "react";
import {
  AmbientLight,
  BackSide,
  BoxBufferGeometry,
  Camera,
  Fog,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereBufferGeometry,
  SpotLight,
  TetrahedronBufferGeometry,
  TorusKnotGeometry,
} from "three";

export default function App() {
  const [camera, setCamera] = React.useState<Camera | null>(null);

  let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = 0x6ad6f0;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(45, width / height, 0.1, 20000);
    camera.position.set(0, 150, 400);

    camera.position.set(2, 5, 5);

    setCamera(camera);

    const scene = new Scene();
    scene.fog = new Fog(sceneColor, 1, 10000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    const createCelShadedModel = (geometry, color) => {
      const material = new MeshNormalMaterial();
      const model = new Mesh(geometry, material);
      const outline = new Mesh(
        geometry,
        new MeshBasicMaterial({ color, side: BackSide })
      );
      outline.scale.multiplyScalar(1.05);
      model.add(outline);
      return model;
    };

    const items = [
      {
        color: 0xccffcc,
        geometry: new SphereBufferGeometry(0.5, 32, 16),
      },
      {
        color: 0x00ffcc,
        geometry: new BoxBufferGeometry(1, 1, 1),
      },
      {
        color: 0xffffff,
        geometry: new TetrahedronBufferGeometry(0.5, 1),
      },
      {
        color: 0xff00cc,
        geometry: new TorusKnotGeometry(0.5, 0.25, 100, 16),
      },
    ];

    items.map((item, index) => {
      const model = createCelShadedModel(item.geometry, item.color);
      scene.add(model);
      const offset = 1.5;
      model.position.set(-(offset * (items.length / 2)) + offset * index, 0, 0);
    });

    // Setup an animation loop
    const render = () => {
      timeout = requestAnimationFrame(render);

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <OrbitControlsView style={{ flex: 1 }} camera={camera}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </OrbitControlsView>
  );
}
