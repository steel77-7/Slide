"use client"

const crypto = require('crypto');

export default function generateToken(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

