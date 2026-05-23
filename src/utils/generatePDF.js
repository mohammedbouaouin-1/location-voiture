import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (booking, isUser = false) => {
  const doc = new jsPDF();
  
  
  const champagneColor = [196, 164, 124]; 
  const onyxColor = [17, 24, 39]; 

  
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  
  const clientName = booking.fullName || booking.user?.name || urlParams.get('fullName') || 'Client Premium';
  const clientPhone = booking.phone || urlParams.get('phone') || 'Non renseigné';
  const clientEmail = booking.user?.email || 'Non renseigné';
  
  const carName = booking.car?.name || booking.carName || urlParams.get('carName') || "Véhicule Premium";
  const totalPrice = booking.totalPrice || urlParams.get('totalPrice') || '-';
  const rawStartDate = booking.startDate || urlParams.get('startDate');
  const rawEndDate = booking.endDate || urlParams.get('endDate');
  
  const startDate = rawStartDate ? new Date(rawStartDate).toLocaleDateString('fr-FR') : '-';
  const endDate = rawEndDate ? new Date(rawEndDate).toLocaleDateString('fr-FR') : '-';

  
  let calculatedCarPrice = booking.car?.price && booking.car.price > 0 ? booking.car.price : undefined;
  if (!calculatedCarPrice && totalPrice !== '-' && rawStartDate && rawEndDate) {
    const s = new Date(rawStartDate);
    const e = new Date(rawEndDate);
    let diffDays = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) diffDays = 1;
    calculatedCarPrice = Math.round(Number(totalPrice) / diffDays);
  }
  const carPrice = calculatedCarPrice || '-';

  const receiptNum = booking._id 
    ? `LF-${booking._id.substring(0, 8).toUpperCase()}` 
    : `LF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  
  doc.setFontSize(28);
  doc.setTextColor(onyxColor[0], onyxColor[1], onyxColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("LOCA", 20, 30);
  
  doc.setTextColor(champagneColor[0], champagneColor[1], champagneColor[2]);
  doc.text("FÈS", 55, 30); 
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("L'Excellence Automobile", 20, 38);
  doc.text("123 Avenue des Forces Armées Royales", 20, 44);
  doc.text("Fès, Maroc 30000", 20, 50);
  doc.text("Contact : contact@locafes.ma | +212 5XX XX XX XX", 20, 56);
  
  
  doc.setFillColor(248, 245, 240); 
  doc.roundedRect(120, 20, 70, 40, 3, 3, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(onyxColor[0], onyxColor[1], onyxColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("REÇU DE LOCATION", 130, 32);
  
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.setFont("helvetica", "normal");
  doc.text(`N° : ${receiptNum}`, 130, 42);
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 130, 50);
  
  
  doc.setDrawColor(champagneColor[0], champagneColor[1], champagneColor[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 70, 190, 70);

  
  doc.setFontSize(11);
  doc.setTextColor(champagneColor[0], champagneColor[1], champagneColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("LOUÉ À :", 20, 85);
  
  doc.setFontSize(11);
  doc.setTextColor(onyxColor[0], onyxColor[1], onyxColor[2]);
  doc.text(clientName.toUpperCase(), 20, 93);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  if (isUser) {
    doc.text(`Email : ${clientEmail}`, 20, 100);
  }
  doc.text(`Tél : ${clientPhone}`, 20, isUser ? 107 : 100);

  
  autoTable(doc, {
    startY: 120,
    headStyles: { 
        fillColor: onyxColor, 
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'center'
    },
    bodyStyles: { 
        textColor: 50, 
        halign: 'center',
        padding: 5
    },
    alternateRowStyles: { fillColor: [248, 245, 240] },
    columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', textColor: [17, 24, 39] }
    },
    head: [['Désignation du véhicule', 'Prise en charge', 'Restitution', 'Prix Journalier']],
    body: [
      [
        carName, 
        startDate, 
        endDate, 
        `${carPrice} DH`
      ],
    ],
  });

  const finalY = (doc).lastAutoTable.finalY + 30;

  
  doc.setFillColor(248, 245, 240);
  doc.roundedRect(110, finalY - 15, 80, 35, 4, 4, 'F');

  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PAYÉ :", 120, finalY + 5);
  
  doc.setFontSize(22);
  doc.setTextColor(champagneColor[0], champagneColor[1], champagneColor[2]);
  doc.text(`${totalPrice} DH`, 185, finalY + 6, null, null, "right");

  
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.setFont("helvetica", "italic");
  doc.text("Ce reçu électronique confirme votre réservation et fait office de preuve de paiement.", 105, 270, null, null, "center");
  doc.text("Toute l'équipe LocaFès vous souhaite une excellente route.", 105, 275, null, null, "center");

  doc.save(`Recu_LocaFes_${receiptNum}.pdf`);
};
