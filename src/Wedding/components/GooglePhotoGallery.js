import React, { useEffect } from "react";

const GooglePhotoGallery = () => {
  useEffect(() => {
    // Dynamically load the external script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="pa-gallery-player-widget"
      style={{ width: "100%", height: "800px", display: "none" }}
      data-link="https://photos.app.goo.gl/YijBRomeq3BrX9Qc8"
      data-title="20 new items by Hitesh Patel"
      data-delay="2"
      data-background-color="#fff5e6"
    >
      <object data="https://lh3.googleusercontent.com/pw/AP1GczNcE-4ylLU3KPHmwwvSdoyC8vxBLcjsN4STPn_u2J4AQF2ZZ1AIbd1R_Abmcmrc08P3RbR_IJbkCcWk62Ie7lmkWSTzygSoi5M2452Egz2iGK_W4Ouz=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczPH_FEC5Grly5L-hpeyb34nbPEHZN7nfLLBYAfTrrbMN3BoB2LhFpwu9I4zmoWA6LXMO-tqaUyxNQsuh7SIz_lgQACK0zaMPoHUC9hCty4A9OTg8YPt=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczMMFDQ8duv0F4qUQVOovDxc2o2nWp3iYWAjA-s5eS-3ChbKuN1Slv3_fbIgb8bD0ckNdaitlbdDwbjJ3l0ZjFw72rxTf7-OtpJrGtoi7a7GYgRNzbWp=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczNHlkOBjNYUr3oRBMwwzjaIzc5xbBv23iP0H9_gIHWcFutOcGpS9o8NtJ3JfE_c32bRy-whkHLZlKX8_n8pI-wye2Aq8r5ylrn-O7j-NdHfxBFZf0jT=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczP1V9TpwSNWjGcI3gNYT19EAzZ4jepztdDhrSiM4J8XhgSsB1bJETv9CzymcJi69_G_o9eW4ZxKK-sm9na5x_ESWfGENUDB-VfpL2mJqUGAc5ptLXbC=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczMwdpkPM1PGRKj1fqiY1ie1ge7WFdr5DRyh-Ec7eBqxAahUgrb1U017jRiUWyd3UqcgcidDuFPjvBdU7PRQo5MmYKM5sEhuWuDebNWYgaUuS_5XoaTC=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczOMl1jv1npxfWnPJIikoj9WpSZ0MMfOGu318nEPAhTPgeZTBRge575qpt3wDc3NM6qfhl331kopqbQfA0nwu-7qSYHDY3kRQ2JHMEpVhGe2qBEOKI-I=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczPp4elpbk6Me_ADIny7Zh24PtBEYh_VqELtHPoXVIeVgkyP6TiQ0nMugBK4bePgDccJsEc4moEqUdKZbQGeg2fAD0doJDb25vJPx5w_tab6zj071HHp=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczMwETdWyooDmXQAf5CqX7MJDzFjHcoFIjfOoffUeH0L-WUT-c5aeAhmY-vbIVewb5QNB5S5P7q2fts0AgXB0-5BYG8RyfOGkWA5tKbdoq9oUIfROrQs=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczOS-2wvTps7Hp4eQqAQ-yimrb9QTBvqH5wqov2TEjOYXuDfUeVYP6ffPLSER13d9I5ScdfexRjtlSKbxUBnC12aL9okhNKIXgzlryxSTLr_mah20D0r=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczOP6X3QaTNTVCbTKZnTH0kXZqVxEmU0mhy5M9OyW07Zd8eT9kcP-GwLq973XV6Bp5idam3EOuKUEZeryrPlRDK2sqbGdFGUc1-lvdsN5tnXdYM-O_iV=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczMYbo4IF4xEr2SgAgLwWirAEJACJZ1UfcNm70fwDdq1GGLF15-MJPT__OT8wE1DJNLcs1V-DUb0ovw7FP5pojiVYGPoJjvsSq_VXEAsrQDM9pfvLpxK=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczPWeZaNC3t792ZRciJ_qjwdrKJPhs2JlebJM4EooYNfxU1N2XgIyU8q4Hsufay0K5K6ZoBaBrhCVjPQHzN_mnErqa5Wp3F-OHduC6LRsn5iIuiwGHeg=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczNVIWowsaivGyQOyJPCPP3ZFFvWHYS_LamISv37wdocyi4AQjivyLk_gTZiRpLhrcKGPi9EKU9j_ISi_-lIppkl2kkjO3ZH9H7kHJ4XVQjStM5J0euq=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczOtOn6SVGu55LwNYfu63oblXwBIdbi0GVKYtBdYlWDWa5EKPf9mGovHgD6aEp8kISMSgYb9-9jBdoS1DWf1-Ngs3NrILTUKPVP3lqR8AmFqN4cl9ukI=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczNbfwWkeWAOLyUTnUTkiCFA8Jh-cvjUTAvjev6HlLgkisMyx7LkuFvwfVivnXMo0mWK0Ofcxf0PyM4j6FEMWiGrM7kOuHkVmj9wthPC9QKZUeYXH2QR=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczPRjRgmue_Y5gEB5mYOQ9h-UOeRRdNMoVP_HgxaYUxAyMoGWBPaizVelrpXpGw4umYHf8ASOLpufoFwEQWs-jQDM8TqahWNpWS36wSTSS2jQQmUTHzM=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczOVv3Y9GusRSrXtXgahegop_ze-GnFyqG6NAmYWT5oA14EhjFzJR6lyq6GI3jwXKL49QFYAs9IOw-kU2AOUeJDKn1gAb1meR8q3e7On0mudR8PeMp8R=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczOUC41E40Y1kIJOkuT1osYXxNlLdj0I6PiDW1yP0ryVLNOEyZ-KTxVAdTHIiI6NHWkxjFCFeMeUHi3Rw9djgq-h1GXhoc6JFZi4OCvlsFX9Di0PFf9o=w1920-h1080"></object>
      <object data="https://lh3.googleusercontent.com/pw/AP1GczMJkNuVjzUuh6rQUCej4LFCZJu_OfnK-oiB-kJYWZHc34cB3i0kGo3Vvwwq-rt5TohGoTCUCqTjc6zAz08-5Hmmrl-qPfDvl8ntdz3oHHH47Vh3AcPD=w1920-h1080"></object>
    </div>
  );
};

export default GooglePhotoGallery;
