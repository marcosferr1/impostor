// Sistema de anuncios - Google AdSense
// Configuración básica - Google AdSense se encarga del resto automáticamente

const AdsConfig = {
  publisherId: 'ca-pub-4136717777404755', // ✅ TU ID CONFIGURADO
  
  // Desktop - Anuncios laterales
  sidebarLeftId: '1734930678',  // ✅ Slot ID izquierdo
  sidebarRightId: '9421849006', // ✅ Slot ID derecho
  
  // Móvil - Banners horizontales
  mobileTopId: '6950780090',    // ✅ Slot ID superior móvil
  mobileBottomId: '2768810746', // ✅ Slot ID inferior móvil
  
  enabled: true // ✅ ACTIVADO
};

// Función para cargar el script de AdSense
function loadAdSenseScript() {
  if (!AdsConfig.enabled || AdsConfig.publisherId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    console.log('AdSense no configurado. Lee las instrucciones en ads.js');
    return;
  }

  // Verificar si el script ya está cargado
  const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`);
  if (existingScript) {
    console.log('AdSense script ya está cargado');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AdsConfig.publisherId}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  
  console.log('✅ AdSense script cargado. Google inicializará los anuncios automáticamente.');
}

// Cargar AdSense cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAdSenseScript);
} else {
  loadAdSenseScript();
}

window.AdsConfig = AdsConfig;
