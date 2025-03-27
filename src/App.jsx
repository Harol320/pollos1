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
    appId: "1:51947527201:web:6502d9498a58660f129760"
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

  // Estilos en línea
  const estilos = {
    body: {
       backgroundImage: "url(''),
       backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "cover",
      margin: 500,
    },
    container: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "16px",
      padding: "2rem",
      maxWidth: "500px",
      width: "100%",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "2rem",
      color: "#333",
      textAlign: "center",
      marginBottom: "1rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "1rem",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1rem",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "pointer",
    },
    calcularButton: {
      backgroundColor: "#007BFF",
      color: "#fff",
    },
    limpiarButton: {
      backgroundColor: "#6c757d",
      color: "#fff",
    },
    resultado: {
      marginTop: "1rem",
      backgroundColor: "#d4edda",
      color: "#155724",
      padding: "1rem",
      borderRadius: "8px",
      textAlign: "center",
    },
  };

  return (
    <div style={estilos.body}>
      <div style={estilos.container}>
        <h1 style={estilos.title}>Calculadora de Comida para Pollos</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calcularComida();
          }}
        >
          <div>
            <label>Número de pollos</label>
            <input
              type="number"
              style={estilos.input}
              value={numPollos}
              onChange={(e) => setNumPollos(e.target.value)}
              placeholder="Ingresa el número de pollos"
              min="1"
              required
            />
          </div>

          <div>
            <label>Tipo de alimento</label>
            <select
              style={estilos.input}
              value={tipoAlimento}
              onChange={(e) => setTipoAlimento(e.target.value)}
            >
              <option value="grano">Grano (0.15 kg/pollo/día)</option>
              <option value="pienso">Pienso (0.12 kg/pollo/día)</option>
            </select>
          </div>

          <div>
            <label>Duración (días)</label>
            <input
              type="number"
              style={estilos.input}
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              placeholder="Ingresa la cantidad de días"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...estilos.button, ...estilos.calcularButton }}
          >
            Calcular
          </button>
          <button
            type="button"
            onClick={limpiarCampos}
            style={{ ...estilos.button, ...estilos.limpiarButton }}
          >
            Limpiar
          </button>
        </form>

        {resultado && (
          <div style={estilos.resultado}>
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
