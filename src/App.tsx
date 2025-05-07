import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Button = ({ children, onClick, disabled  }: any) => {
  return (
    <button
      className="w-38 rounded-3xl font-bold py-2 text-center transition-all
        bg-fuchsia-900 hover:bg-fuchsia-950 disabled:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

function App() {
  const [code, setCode] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [qr, setQr] = useState<string>("");

  const [error, setError] = useState<string>("");
  //const [loading, setLoading] = useState<boolean>(false);

  const handleError = (error: string) => {
    setError(error);
    setTimeout(() => setError(""), 3000);
  };

  const generateQr = async () => {
    if (!code) {
      handleError("Please enter a URL or text");
      return;
    }

    try {
      const res = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=${
          size ? `${size}x${size}` : "256x256"
        }&data=${code}`
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setQr(url);
    } catch {
      handleError("Error generating QR code");
    }
  };

  const downloadQr = () => {
    if (!qr) return;
    const link = document.createElement("a");
    link.href = qr;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <>
      <section className="h-auto md:h-140 bg-fuchsia-1000 flex justify-between flex-col-reverse md:flex-row md:items-center w-auto md:w-xl lg:w-3xl rounded-4xl p-5 lg:p-14 md:box-content lg:box-border">
        {/* QR CODE */}
        <div className="flex flex-col items-center justify-center box-border">
          {/* <p className="text-4xl w-50 text-center mb-15">Here is your QR Code</p> */}

          <div className="flex items-center justify-center w-75 h-75 bg-white rounded-3xl mb-10">
            {qr ? (
              <img src={qr} alt="QR Code" />
            ) : (
              <img src="/example.png" alt="Logo" />
            )}
          </div>
          <Button onClick={downloadQr} disabled={!qr}>
            Download
          </Button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col items-center justify-center mb-12 md:mb-0">
          <h1 className="mb-5 md:mb-17">
            <img className="" src="/logo.svg" alt="Logo" />
          </h1>
          <form className="flex flex-col items-center justify-center md:mb-25">
            <label htmlFor="" className="flex flex-col mb-3">
              <p className="mb-1">Submit URL or text</p>
              <input
                type="text"
                name=""
                id=""
                className="w-62 bg-fuchsia-1100 rounded-2xl placeholder-white placeholder:opacity-25 pl-3.5 py-1"
                placeholder="Enter text or URL here "
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
            <label htmlFor="" className="flex flex-col mb-5">
              <p className="mb-1">Image size</p>
              <input
                type="text"
                name=""
                id=""
                className="w-62 bg-fuchsia-1100 rounded-2xl placeholder-white placeholder:opacity-25 pl-3.5 py-1"
                placeholder="Enter only one num (1-256)"
                value={size}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsed = parseInt(value);

                  setSize(isNaN(parsed) ? "" : `${parsed}`);
                }}
              />
            </label>
            <Button onClick={() => generateQr()}>Generate</Button>
          </form>
          <a
            href="https://github.com/RomanMartseniuk/qr-code-generator"
            className="ml-auto hidden md:block"
          >
            <img src="/gh.png" alt="GitHub" />
          </a>
        </div>
      </section>

      {error && <div className="">{error}</div>}
    </>
  );
}

export default App;
