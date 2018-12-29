/** @format */

'use strict';

const net = require('net');

module.exports = (host, port, connectTimeout) => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(parseInt(connectTimeout, 10));
    socket.connect(
      parseInt(port, 10),
      host
    );

    // Establish the connection, returns `true`
    socket.on('connect', () => {
      socket.destroy();
      resolve();
    });

    // Connection error, returns error
    socket.on('error', err => {
      socket.destroy();
      reject(err);
    });

    // Connection timeout, returns error
    socket.on('timeout', err => {
      socket.destroy();
      reject(err);
    });
  });
};
