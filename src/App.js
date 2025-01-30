import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function App() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [smsLink, setSmsLink] = useState("");

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
          if (window.confirm(`Open messaging app to text ${phoneParam}?`)) {
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

  return (
    <div style={{width : "100%", display:'flex', justifyContent: "center"}}>
    <div style={{width : "50%", display:'flex', justifyContent: "center", flexDirection:'column'}}>
      <h1 className="text-2xl font-bold"><center>SMSer Pigeon</center></h1>
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
      <p/>
      <button onClick={generateLink} className="p-2 bg-blue-500 text-white rounded">
        Generate SMS Link
      </button>
      {smsLink && (
        <div className="flex flex-col items-center space-y-2">
          <p/>
          <div style={{width : "100%", display:'flex', justifyContent: "space-around"}}>
            <div>SMS Link</div>
            <button onClick={copyToClipboard} className="p-2 bg-gray-300 rounded">
             Copy Link
            </button>
          </div>
          <div style={{width : "100%", display:'flex', justifyContent: "center", alignContent:'center'}}>
            <a href={smsLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" style={{width: '100%'}}>
            {smsLink}
            </a>
          </div>
          <p/>
          <div style={{width : "100%", display:'flex', justifyContent: "center", alignContent:'center'}}>
            <QRCodeSVG value={smsLink} size={150} />
          </div>
        </div>
      )}
    </div>
    </div>
  );
}