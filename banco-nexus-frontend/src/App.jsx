// src/App.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Button, Image } from 'react-bootstrap';
import VerCuentas from './components/VerCuentas';
import Deposito from './components/Deposito';
import Retiro from './components/Retiro';
import HistorialTransacciones from './components/Transacciones';
import logo from './assets/logo.png';

function App() {
  const [pantalla, setPantalla] = useState('home');

  const renderPantalla = () => {
    switch (pantalla) {
      case 'cuentas': return <VerCuentas />;
      case 'deposito': return <Deposito />;
      case 'retiro': return <Retiro />;
      case 'historial': return <HistorialTransacciones />;
      default: return (
        <div className="text-center mt-8">
          <h2>Bienvenido a Banco Nexus</h2>
          <Button className="m-2" onClick={() => setPantalla('cuentas')}>Ver Cuentas</Button>
          <Button className="m-2" variant="success" onClick={() => setPantalla('deposito')}>Depósito</Button>
          <Button className="m-2" variant="danger" onClick={() => setPantalla('retiro')}>Retiro</Button>
          <Button className="m-2" variant="secondary" onClick={() => setPantalla('historial')}>Historial de transacciones</Button>
        </div>
      );
    }
  };

  return (
    <>
<Navbar bg="dark" variant="dark">
  <Container className="d-flex align-items-center justify-content-start">
    <Navbar.Brand className="d-flex align-items-center">
      <Image
        src={logo}
        alt="Banco Nexus Logo"
        height="80"
        rounded
        className="me-2"
        style={{ backgroundColor: 'white', padding: '6px', borderRadius: '8px' }}
        title="Banco Nexus"
      />
    </Navbar.Brand>

    <Nav className="d-flex align-items-center" style={{ gap: '1.5rem' }}>
      <Nav.Link onClick={() => setPantalla('home')} style={{ fontSize: '1.5rem' }}>Inicio</Nav.Link>
      <Nav.Link onClick={() => setPantalla('cuentas')} style={{ fontSize: '1.5rem' }}>Cuentas</Nav.Link>
      <Nav.Link onClick={() => setPantalla('deposito')} style={{ fontSize: '1.5rem' }}>Depósito</Nav.Link>
      <Nav.Link onClick={() => setPantalla('retiro')} style={{ fontSize: '1.5rem' }}>Retiro</Nav.Link>
      <Nav.Link onClick={() => setPantalla('historial')} style={{ fontSize: '1.5rem' }}>Historial</Nav.Link>
    </Nav>
  </Container>
</Navbar>

      <Container>{renderPantalla()}</Container>
    </>
  );
}

export default App;
