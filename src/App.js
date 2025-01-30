import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { saveAs } from 'file-saver'; // FileSaver.js to download the file as PNG

export default function App() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [smsLink, setSmsLink] = useState("");
  const qrRef = useRef(null); // Reference to the QRCodeCanvas component

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const phoneParam = params.get("phone");
    const messageParam = params.get("message");

    if (phoneParam) setPhone(phoneParam);
    if (messageParam) setMessage(messageParam);

    if (phoneParam && messageParam) {
      const link = `sms:${phoneParam}?body=${encodeURIComponent(messageParam)}`;
      setSmsLink(link);
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        setTimeout(() => {
          if (window.confirm(`Open messaging app to text ${phoneParam} the message "${messageParam}"?`)) {
            window.location.href = link;
          }
        }, 500);
      }
    }
  }, []);

  const generateLink = () => {
    const url = `${window.location.origin + window.location.pathname}?phone=${phone}&message=${encodeURIComponent(message)}`;
    setSmsLink(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(smsLink).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  // Save QR Code as PNG
  const saveQRCode = () => {
    console.log('saveQRCOde')
    if (qrRef.current) {
      console.log('current')
      // Access the canvas element directly
      const canvas = document.getElementById("QRCode");
      if (canvas) {
        console.log('canvas')
        // Convert the canvas to a Blob (PNG image)
        canvas.toBlob((blob) => {
          saveAs(blob, "qrcode.png"); // Use FileSaver.js to save as PNG
        });
      }
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "50%", display: "flex", justifyContent: "center", flexDirection: "column" }}>
        <h1 className="text-2xl font-bold">
          <center>SMSer Pigeon</center>
        </h1>
        <div>Phone Number</div>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 border rounded"
        />
        <div>Message</div>
        <textarea
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border rounded"
        />
        <p />
        <button onClick={generateLink} className="p-2 bg-blue-500 text-white rounded">
          Generate SMS Link
        </button>
        {smsLink && (
          <div className="flex flex-col items-center space-y-2">
            <p />
            <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
              <div>SMS Link</div>
              <button onClick={copyToClipboard} className="p-2 bg-gray-300 rounded">
                Copy Link
              </button>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignContent: "center" }}>
              <a href={smsLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" style={{ width: "100%" }}>
                {smsLink}
              </a>
            </div>
            <p />
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignContent: "center" }}>
              <QRCodeCanvas id="QRCode" ref={qrRef} value={smsLink} size={150} />
            </div>
            <p/>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignContent: "center" }}>
            <button onClick={saveQRCode} className="p-2 bg-green-500 text-white rounded">
              Save QR Code
            </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
