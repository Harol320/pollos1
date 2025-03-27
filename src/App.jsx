import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKJ2lTogRyuKLM9HD5YwGqTaXSu_7AzTs",
  authDomain: "base-34631.firebaseapp.com",
  projectId: "base-34631",
  storageBucket: "base-34631.firebasestorage.app",
  messagingSenderId: "51947527201",
  appId: "1:51947527201:web:6502d9498a58660f129760",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializar Firestore

const App = () => {
  const [numPollos, setNumPollos] = useState("");
  const [tipoAlimento, setTipoAlimento] = useState("grano");
  const [dias, setDias] = useState("");
  const [resultado, setResultado] = useState(null);

  const calcularComida = async () => {
    if (!numPollos || !dias) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const comidaPorPolloPorDia = tipoAlimento === "grano" ? 0.15 : 0.12; // kg por pollo por día
    const totalComida = numPollos * comidaPorPolloPorDia * dias;

    setResultado(totalComida.toFixed(2));

    // Guardar los datos en Firestore
    try {
      await addDoc(collection(db, "calculos"), {
        numPollos: parseInt(numPollos),
        tipoAlimento,
        dias: parseInt(dias),
        totalComida: totalComida.toFixed(2),
        fecha: new Date().toISOString(),
      });
      console.log("Cálculo guardado correctamente en Firestore");
    } catch (error) {
      console.error("Error al guardar el cálculo en Firestore: ", error);
    }
  };

  const limpiarCampos = () => {
    setNumPollos("");
    setTipoAlimento("grano");
    setDias("");
    setResultado(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Calculadora de Comida para Pollos
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calcularComida();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de pollos
            </label>
            <input
              type="number"
              className="mt-1 p-2 w-full border rounded-lg"
              value={numPollos}
              onChange={(e) => setNumPollos(e.target.value)}
              placeholder="Ingresa el número de pollos"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de alimento
            </label>
            <select
              className="mt-1 p-2 w-full border rounded-lg"
              value={tipoAlimento}
              onChange={(e) => setTipoAlimento(e.target.value)}
            >
              <option value="grano">Grano (0.15 kg/pollo/día)</option>
              <option value="pienso">Pienso (0.12 kg/pollo/día)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duración (días)
            </label>
            <input
              type="number"
              className="mt-1 p-2 w-full border rounded-lg"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              placeholder="Ingresa la cantidad de días"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Calcular
          </button>
          <button
            type="button"
            onClick={limpiarCampos}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 mt-2"
          >
            Limpiar
          </button>
        </form>

        {resultado && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            <p>
              Total de comida necesaria: <strong>{resultado} kg</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
