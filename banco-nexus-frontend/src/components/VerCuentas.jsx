import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { obtenerCuenta } from '../api'; // Ajusta la ruta si lo guardaste en otra carpeta

const VerCuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);

  useEffect(() => {
    const cargarCuentas = async () => {
      try {
        const data = await obtenerCuenta();
        setCuentas(data);
      } catch (error) {
        console.error("Error al obtener cuentas:", error);
      }
    };

    cargarCuentas();
  }, []);

  const handleMostrar = (cuenta) => {
    setCuentaSeleccionada(cuenta);
    setMostrarModal(true);
  };

  const handleCerrar = () => {
    setMostrarModal(false);
    setCuentaSeleccionada(null);
  };

  return (
    <div className="mt-4">
      <h3>Listado de Cuentas</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Número de Cuenta</th>
            <th>Saldo</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((cuenta, index) => (
            <tr key={index}>
              <td>{cuenta.cliente?.nombre || 'Sin nombre'}</td>
              <td>{cuenta.cuenta}</td>
              <td>${cuenta.saldo}</td>
              <td>
                <Button variant="info" onClick={() => handleMostrar(cuenta)}>
                  Más información
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={mostrarModal} onHide={handleCerrar} centered>
        <Modal.Header closeButton>
          <Modal.Title>Información de la Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cuentaSeleccionada && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={cuentaSeleccionada.cliente?.nombre} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>CURP</Form.Label>
                <Form.Control value={cuentaSeleccionada.cliente?.curp} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Número de Cuenta</Form.Label>
                <Form.Control value={cuentaSeleccionada.cuenta} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Saldo</Form.Label>
                <Form.Control value={`$${cuentaSeleccionada.saldo}`} readOnly />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrar}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VerCuentas;
