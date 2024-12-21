function handleSubmit(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const data = {};

    for (let [key, value] of formData.entries()) {
        if (key.endsWith('[]')) {
            // Handle array fields
            const cleanKey = key.slice(0, -2);
            if (!data[cleanKey]) {
                data[cleanKey] = [];
            }
            data[cleanKey].push(value);
        } else {
            data[key] = value;
        }
    }

    // Generate PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add personal information
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Resume", 105, 10, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Name: ${data.fullName || ""}`, 10, 30);
    doc.text(`Address: ${data.address || ""}`, 10, 40);
    doc.text(`Phone: ${data.phone || ""}`, 10, 50);
    doc.text(`Email: ${data.email || ""}`, 10, 60);

    // Add education
    doc.text("Education", 10, 80);
    (data.qualification || []).forEach((_, index) => {
        const y = 90 + index * 10;
        doc.text(`${data.qualification[index]} - ${data.institution[index]} (${data.yearOfPassing[index]}), ${data.percentage[index]}`, 10, y);
    });

    // Add skills and achievements
    doc.text("Achievements", 10, 120);
    (data.achievements || []).forEach((achievement, index) => {
        doc.text(`${index + 1}. ${achievement}`, 10, 130 + index * 10);
    });

    doc.text("Software Skills", 10, 150);
    (data.software || []).forEach((software, index) => {
        doc.text(`${index + 1}. ${software}`, 10, 160 + index * 10);
    });

    // Download the PDF
    doc.save(`${data.fullName}_Resume.pdf`);
}
