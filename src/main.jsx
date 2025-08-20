import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Ensure meshopt decoder is registered before any GLTFLoader loads compressed models
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

try {
  // حاول التسجيل بالطريقة الأولى (static)
  if (typeof GLTFLoader.setMeshoptDecoder === "function") {
    GLTFLoader.setMeshoptDecoder(MeshoptDecoder);
  } else {
    // إن لم تكن متوفرة، أنشئ لودر مؤقت وجرب التسجيل على المثيل
    const tmp = new GLTFLoader();
    if (typeof tmp.setMeshoptDecoder === "function") {
      tmp.setMeshoptDecoder(MeshoptDecoder);
    } else {
      // fallback: أضف method إلى prototype ثم استدعيها على مثيل جديد
      GLTFLoader.prototype.setMeshoptDecoder = function (decoder) {
        this._meshoptDecoder = decoder;
      };
      new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    }
  }
} catch (err) {
  console.warn("Meshopt decoder registration failed:", err);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
