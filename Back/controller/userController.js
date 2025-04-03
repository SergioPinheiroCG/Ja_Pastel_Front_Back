const mongoose = require("mongoose");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    let { nome, email, senha, cpf, telefone } = req.body;

    const user = new User({
      nome,
      email: email.trim().toLowerCase(),
      senha, // Envie a senha em texto puro
      cpf,
      telefone,
    });

    const newUser = await user.save();

    // Remova a senha do objeto retornado
    newUser.senha = undefined;

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro detalhado no registro:", error);
    return res.status(500).json({
      message: "Erro ao registrar usuário",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, senha } = req.body;
    email = email.trim().toLowerCase();

    let userExistente = await User.findOne({ email }).select("+senha");

    if (!userExistente) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const isMatch = await userExistente.comparePassword(senha);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    userExistente.senha = undefined;

    const token = jwt.sign(
      { id: userExistente._id, email: userExistente.email },
      secret,
      { expiresIn: "30d" }
    );

    return res.json({
      user: {
        id: userExistente._id,
        nome: userExistente.nome,
        email: userExistente.email,
      },
      token,
    });
  } catch (error) {
    console.error("Erro detalhado no login:", error);
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
};

const validacaoCpf = (cpf) => {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }
  let soma = 0,
    resto;

  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
};

const getMe = async (req, res) => {
  try {
    // O usuário já está disponível via middleware
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};




module.exports = { register, login, validacaoCpf, getMe };
