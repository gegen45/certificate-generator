document.getElementById('generateBtn').addEventListener('click', function() {
    const imageUpload = document.getElementById('imageUpload');
    const participantName = document.getElementById('participantName').value;
    const certificateNumber = document.getElementById('certificateNumber').value;
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    const downloadLink = document.getElementById('downloadLink');

    // Variabel untuk posisi teks nama dan nomor sertifikat
    const nameVerticalOffset = -50; // Offset vertikal dari posisi Y teks nama
    const numberVerticalOffset = 180; // Offset vertikal dari posisi Y nomor sertifikat

    if (imageUpload.files && imageUpload.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Set font size relative to canvas size for participant name
                const fontSize = canvas.width / 15;
                ctx.font = `${fontSize}px 'Brittany'`;
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Calculate position for the participant name
                const nameX = canvas.width / 2;
                const nameY = canvas.height / 2 + nameVerticalOffset;

                // Add the participant name to the canvas
                ctx.fillText(participantName, nameX, nameY);

                // Set font size for certificate number
                const numberFontSize = canvas.width / 40;
                ctx.font = `${numberFontSize}px 'Brittany'`;
                ctx.font = `${numberFontSize}px 'Arial'`;

                // Calculate position for the certificate number
                const numberX = canvas.width / 2;
                const numberY = canvas.height / 2 + numberVerticalOffset;

                // Add the certificate number to the canvas
                ctx.fillText(certificateNumber, numberX, numberY);

                // Set up the download link
                canvas.style.display = 'block';
                downloadLink.href = canvas.toDataURL('image/png');
                downloadLink.download = 'certificate.png';
                downloadLink.style.display = 'block';
                downloadLink.textContent = 'Download Certificate';
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(imageUpload.files[0]);
    }
});
