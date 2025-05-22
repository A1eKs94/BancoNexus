const mongoose = require("mongoose");

const cuentaSchema = new mongoose.Schema({
  cuenta: String,
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  saldo: Number,
});

module.exports = mongoose.model("Cuentas", cuentaSchema);
