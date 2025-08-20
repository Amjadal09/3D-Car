import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import { Box3, Vector3 } from "three";

const DESIRED_MODEL_SIZE = 2; // الحجم المرجو للموديل (والمسْتعمل لتحديد منصة أكبر بقليل)

function FerrariModel() {
  const { scene } = useGLTF("/models/ferrari.glb");
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const obj = ref.current;
    const box = new Box3().setFromObject(obj);
    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const desired = DESIRED_MODEL_SIZE; // استخدام الثابت العام
      const scale = desired / maxDim;
      obj.scale.setScalar(scale);
      const box2 = new Box3().setFromObject(obj);
      const center = new Vector3();
      box2.getCenter(center);
      obj.position.sub(center);
      const box3 = new Box3().setFromObject(obj);
      const minY = box3.min.y;
      obj.position.y -= minY;
    }
  }, [scene]);

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

export default function Lobby() {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas shadows dpr={[1, 2]}>
        {/* الكاميرا */}
        <PerspectiveCamera makeDefault fov={35} position={[0, 1.5, 10]} />

        {/* إضاءة سينمائية */}
        <spotLight
          position={[0, 5, 5]}
          angle={0.35}
          penumbra={0.4}
          intensity={3}
          castShadow
        />
        <spotLight
          position={[-4, 2, 2]}
          intensity={1}
          color="red"
          angle={0.4}
        />
        <spotLight
          position={[4, 2, 2]}
          intensity={1}
          color="white"
          angle={0.4}
        />

        {/* إضافات الإضاءة المطلوبة */}
        <ambientLight intensity={0.5} /> {/* إضاءة عامة خفيفة */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
        />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          intensity={2}
          penumbra={1}
          castShadow
        />

        {/* أرضية / المنصة - دائرية، أعرض بقليل من السيارة */}
        {(() => {
          const platformMargin = 1.5; // كم أكبر من الموديل (بالوحدات العالمية)
          const radius = DESIRED_MODEL_SIZE / 2 + platformMargin; // اضبط حسب مقياسك
          return (
            <mesh rotation={[0, 0, 0]} receiveShadow position={[0, -0.51, 0]}>
              <cylinderGeometry args={[radius, radius, 0.08, 128]} />
              <meshStandardMaterial 
                color={"#aaaaaa"}
                metalness={1}
                roughness={0.05}
              />
            </mesh>
          );
        })()}

        {/* Ferrari */}
        <Suspense fallback={null}>
          <FerrariModel />
        </Suspense>

        {/* مؤقت للتحكم */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
