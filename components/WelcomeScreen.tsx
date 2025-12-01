 import React, { useState, useEffect } from 'react';
 import './WelcomeScreen.css'; // Importa el archivo de estilos CSS
 

 interface WelcomeScreenProps {
  onClose: () => void;
 }
 

 const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onClose }) => {
  return (
  <div className="welcome-screen">
  <div className="welcome-content">
  <h1>Laboratorio Electoral</h1>
 <p>
  El Simulador está basado en la teoría de <strong>Cadenas de Markov</strong>, la <strong>Teoría de Juegos</strong>, y patrones históricos de comportamiento electoral.<br />
  Su propósito es proyectar cómo cambiarían las preferencias de los votantes según los <strong>perfiles de los candidatos</strong>, sus <strong>estrategias</strong>, y el <strong>contexto político</strong>.<br /><br />
  Cada escenario es una simulación estructurada, respaldada por <strong>modelos probabilísticos</strong> y <strong>reglas estratégicas</strong> que reflejan dinámicas electorales reales.
</p>
  <button onClick={onClose}>Comenzar</button>
  </div>
  </div>
  );
 };
 

 export default WelcomeScreen;
