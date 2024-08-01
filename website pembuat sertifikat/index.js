document.getElementById('generateBtn').addEventListener('click', generateCertificates);
document.getElementById('dataUpload').addEventListener('change', handleDataUpload);

let data = []; // Menggunakan let untuk memungkinkan perubahan nilainya

function handleDataUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    if (fileExtension === 'csv') {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                data = results.data.map(row => ({ 
                    name: row['Nama'], 
                    number: row['Nomor'] 
                })); // Sesuaikan kunci sesuai dengan header CSV/Excel Anda
            }
        });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const binaryString = e.target.result;
            const workbook = XLSX.read(binaryString, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            data = jsonData.map(row => ({ 
                name: row['Nama'], 
                number: row['Nomor'] 
            })); // Sesuaikan kunci sesuai dengan header CSV/Excel Anda
        };
        reader.readAsBinaryString(file);
    }
}

async function generateCertificates() {
    for (let i = 0; i < data.length; i++) {
        const participantName = data[i].name;
        const certificateNumber = data[i].number;
        await generateCertificate(participantName, certificateNumber);
    }
}

async function generateCertificate(participantName, certificateNumber) {
    const imageUpload = document.getElementById('imageUpload');
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    const downloadLink = document.getElementById('downloadLink');

    // Variabel untuk posisi teks nama dan nomor sertifikat
    const nameVerticalOffset = -50; // Offset vertikal dari posisi Y teks nama
    const numberVerticalOffset = 190; // Offset vertikal dari posisi Y nomor sertifikat

    if (imageUpload.files && imageUpload.files[0]) {
        const templateDataUrl = await getFileDataUrl(imageUpload.files[0]);
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
            ctx.font = `${numberFontSize}px 'Arial'`;

            // Calculate position for the certificate number
            const numberX = canvas.width / 2;
            const numberY = canvas.height / 2 + numberVerticalOffset;

            // Add the certificate number to the canvas
            ctx.fillText(certificateNumber, numberX, numberY);

            // Set up the download link
            canvas.style.display = 'block';
            downloadLink.href = canvas.toDataURL('image/png');
            downloadLink.download = `${participantName}_certificate.png`;
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Download Certificate';

            // Automatically click the download link to save the file
            downloadLink.click();
        };
        img.src = templateDataUrl;
    }
}

function getFileDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
