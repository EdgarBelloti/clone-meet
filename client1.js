// client1.js
const socket = io(); // Conectando ao servidor

// Solicitar acesso à webcam e microfone
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    const videoElement = document.getElementById('video1'); // O elemento de vídeo no HTML
    videoElement.srcObject = stream; // Configura o stream de vídeo no elemento

    socket.on('signal', (data) => {
      console.log('Sinal recebido:', data);
      // Aqui você pode lidar com o sinal, como configurar a conexão de vídeo
    });

    // Exemplo de enviar um sinal
    // Você deve substituir 'TO_CLIENT_ID' pelo ID do cliente para o qual você está enviando o sinal
    socket.emit('signal', {
      to: 'TO_CLIENT_ID',
      signal: 'Sinal de vídeo do Cliente 1',
    });
  })
  .catch((error) => {
    console.error('Erro ao acessar webcam e microfone:', error);
  });
