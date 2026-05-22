// Add subtle interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Adjust scroll position for navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
            navbar.style.backgroundColor = 'rgba(250, 247, 242, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            navbar.style.backgroundColor = 'rgba(250, 247, 242, 0.95)';
        }
    });

    // Convert HEIC images on the fly
    if (typeof heic2any !== 'undefined') {
        const heicImages = document.querySelectorAll('img[src$=".HEIC"], img[src$=".heic"]');
        heicImages.forEach(img => {
            const originalSrc = img.src;
            const fileName = originalSrc.split('/').pop();
            const b64 = (typeof heicData !== 'undefined') ? (heicData[fileName] || heicData[decodeURIComponent(fileName)]) : null;
            
            if (b64) {
                // Decode base64 to Uint8Array
                const binaryString = window.atob(b64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], {type: 'image/heic'});
                
                heic2any({ blob, toType: 'image/jpeg', quality: 0.8 })
                    .then(conversionResult => {
                        const finalBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
                        const url = URL.createObjectURL(finalBlob);
                        img.src = url;
                    })
                    .catch(err => console.error("Error converting HEIC image: ", originalSrc, err));
            } else {
                console.warn("Base64 data not found for:", fileName);
            }
        });
    }
});
