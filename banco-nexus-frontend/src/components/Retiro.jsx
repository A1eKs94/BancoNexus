import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { realizarTransaccion, obtenerCuenta } from '../api'; // ajusta ruta si es necesario

const Retiro = () => {
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => {
    const cargarCuentas = async () => {
      try {
        const data = await obtenerCuenta();
        setCuentas(data);
      } catch (err) {
        console.error("Error al cargar cuentas:", err);
      }
    };
    cargarCuentas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!numeroCuenta || !monto) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const cuentaObj = cuentas.find(c => c.cuenta === numeroCuenta);
    if (!cuentaObj) {
      setError("Número de cuenta no encontrado.");
      return;
    }

    try {
      const data = {
        cuenta: cuentaObj._id,  // ObjectId para backend
        tipo: 'retiro',         // Cambiar el tipo a retiro
        cantidad: Number(monto),
      };

      await realizarTransaccion(data);
      setMensaje("Retiro realizado con éxito.");
      setNumeroCuenta('');
      setMonto('');
    } catch (err) {
      // Aquí puede ser por saldo insuficiente o error general
      setError(err.message || "Error al realizar el retiro.");
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <h3>Retiro de Cuenta</h3>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group className="mb-3">
          <Form.Label>Número de Cuenta</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el número de cuenta"
            value={numeroCuenta}
            onChange={(e) => setNumeroCuenta(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Monto a Retirar</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese el monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            min="1"
          />
        </Form.Group>

        <Button variant="danger" type="submit">
          Realizar Retiro
        </Button>
      </Form>
    </div>
  );
};

export default Retiro;
