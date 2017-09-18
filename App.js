import Expo, { Asset } from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import './util/WindowResize';

import OrbitControls from 'expo-three-orbit-controls';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';

global.THREE = THREE;

console.ignoredYellowBox = [
  'THREE.WebGLRenderer',
  'THREE.WebGLProgram',
];

export default class App extends React.Component {
  state = { camera: null }
  render() {
    // Create an `Expo.GLView` covering the whole screen, tell it to call our
    // `_onGLContextCreate` function once it's initialized.
    return (
      <OrbitControls
        style={{ flex: 1 }}
        camera={this.state.camera}>
        <Expo.GLView
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
      </OrbitControls>

    );
  }

  // This is called by the `Expo.GLView` once it's initialized
  _onGLContextCreate = async (gl) => {
    // Based on https://threejs.org/docs/#manual/introduction/Creating-a-scene
    // In this case we instead use a texture for the material (because textures
    // are cool!). All differences from the normal THREE.js example are
    // indicated with a `NOTE:` comment.

    const scene = new THREE.Scene();
    // NOTE: How to create an `Expo.GLView`-compatible THREE renderer
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    camera = new THREE.PerspectiveCamera(45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 20000);
    scene.add(camera);
    camera.position.set(0, 150, 400);
    camera.lookAt(scene.position);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 150, 100);
    scene.add(light);

    //Background Stage
    scene.add(new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000), new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.BackSide })));


    const createCelShadedModel = (geometry, color) => {
      const material = new THREE.MeshNormalMaterial();
      const model = new THREE.Mesh(geometry, material);
      const outline = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }));
      outline.scale.multiplyScalar(1.05);
      model.add(outline);
      return model;
    }

    const items = [
      {
        color: 0xccffcc,
        geometry: new THREE.SphereGeometry(50, 32, 16),
      },
      {
        color: 0x00ffcc,
        geometry: new THREE.CubeGeometry(80, 62, 80),
      },
      {
        color: 0xffffff,
        geometry: new THREE.TetrahedronBufferGeometry(50, 2),
      },
      {
        color: 0xff00cc,
        geometry: new THREE.TorusKnotGeometry( 60, 3, 100, 16 ),
      }
    ];
    
    items.map((item, index) => {
      const model = createCelShadedModel(item.geometry, item.color);
      scene.add(model);
      model.position.set(-(120 * (items.length / 2)) + 120 * index, 60, 0);
    });

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();
    }
    render();
    this.setState({ camera: camera })

    window.addEventListener('resize', () => {
      const _width = window.innerWidth * window.scale;
      const _height = window.innerHeight * window.scale;
      let windowHalfX = _width / 2;
      let windowHalfY = _height / 2;

      camera.aspect = _width / _height;
      camera.updateProjectionMatrix();

      renderer.setSize(_width, _height);

    })

  }
}

