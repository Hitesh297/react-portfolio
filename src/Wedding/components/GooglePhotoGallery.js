import React, { useEffect } from "react";

const GooglePhotoGallery = () => {
  useEffect(() => {
    // Dynamically load the external script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js";
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
      data-link="https://photos.app.goo.gl/nSMnLdQqErHKkGD48"
      data-title="9 new items by Hitesh Patel"
    >
      <object data="https://lh3.googleusercontent.com/pw/AP1GczOwftfOazIYw9p4ruHvxrm2Nh5_4EiVNKIHOHsb1PPHTbiwq42ilCay-nbqL4Z4zn95eGnwzmoasRBoEdj0HhNOLmr31MYeYD_1JUfbTlW1mX2b9owg=w1920-h1080"></object>
  <object data="https://lh3.googleusercontent.com/pw/AP1GczNEJu1bAplRpiuOd3wwYULIfK4hePQ32m3ahdBNu_v1sW5k3pcZ00Kp-b7Kf8lV8pRp6-QdvlUjWZoAG6CBhVzmD06DSRLEsw0HG5ULfECju6ocKCJn=w1920-h1080"></object>
  <object data="https://lh3.googleusercontent.com/pw/AP1GczOAdA3GWnekg90yzW8_PY6N30SqG8jLNeK7hGrR0yW7ShOnTt_ERwku6CC3-fn3xo62OA24N5xL1p6aQgzwcaxF6Z9q-t5U28ZbCQBq43dJ1t79yXYE=w1920-h1080"></object>
  <object data="https://lh3.googleusercontent.com/pw/AP1GczPxkvSEu5fVYM3hiAcSVu2derQj0kDfXMbaaUL9c93n-rJEzvoOKUinZ-xlnrYdRbLqTrJI7yOCM6jHjexffBIczJmeUVgrh5JFL__LtbB81o8Uya0P=w1920-h1080"></object>
  <object data="https://lh3.googleusercontent.com/pw/AP1GczMefP7JzjKPh_-zIZ8OdYffD-cmo45AE4MboX7x2E8bVhIYk80Uh3tUEd_VSkUm71bP7PN8AHs2VyGyjZOimb5TuMM0oHHwlcTcvdIkzqdA52ITNELL=w1920-h1080"></object>
  <object data="https://lh3.googleusercontent.com/pw/AP1GczPLOZUzUJGbVgswIckjO6ViEES1mIBCs5-Tol6Xq3HxEWMY3vSnIrhl--hEdSCA18mXZOApkc2VR0OE67NyMeYLP6pzP76YQRg1DnS4itEtCUvnkZgq=w1920-h1080"></object>
  <object data="https://lh3.googleusercontent.com/pw/AP1GczOWzHmIIIUOFjV5Cv7Lb9awMht0rFWWY8gh8OFU27eVwL5XXkjDeWKmnmqhCyg7-gzAFx54KVagI3IzMBQ4gx20tecrxUBX5rqnmS_rBXBlbfe_2QTX=w1920-h1080"></object>
  <object data="https://lh3.googleusercontent.com/pw/AP1GczMjbd2oa5QO2EyZbOHWvBup84U5aU9Bep4xMxjHq-cUvVSYSVDkVNcl4YgvqQF9gNaPW4xTq6_VdmO3YwvKlG-yFD0JPM3azsN74qlMbgUG3SvigMIE=w1920-h1080"></object>
  <object data="https://lh3.googleusercontent.com/pw/AP1GczM24lU1jRl0hDRPo590OBlLyuqhlYigUXJCZQbUbDsXCyiHzOKwfId0wIhdBlD0PRxak56yZ2SZjY9BPzqxIznPT5FcvAdqI1PI9KWPpPsrdlb0CGsi=w1920-h1080"></object>
    </div>
  );
};

export default GooglePhotoGallery;
