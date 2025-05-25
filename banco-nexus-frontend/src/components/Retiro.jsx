import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { realizarTransaccion, obtenerCuenta } from '../api'; // ajusta ruta si es necesario

const Retiro = () => {
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [monto, setMonto] = useState('');
  const [sucursal, setSucursal] = useState('CDMX');
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
      setError("Número de cuenta no encontrada.");
      return;
    }

    try {
      const data = {
        cuenta: cuentaObj._id,
        tipo: 'retiro',
        cantidad: Number(monto),
        sucursal,
        fecha: new Date().toISOString()
      };

      await realizarTransaccion(data);
      setMensaje("Retiro realizado con éxito.");
      setNumeroCuenta('');
      setMonto('');
      setSucursal('CDMX');
    } catch (err) {
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

        <Form.Group className="mb-3">
          <Form.Label>Sucursal</Form.Label>
          <Form.Select
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
          >
            <option value="CDMX">CDMX</option>
            <option value="GDL">GDL</option>
            <option value="MTY">Monterrey</option>
            <option value="QRO">Querétaro</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha (automática)</Form.Label>
          <Form.Control
            type="text"
            value={new Date().toLocaleString()}
            disabled
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
