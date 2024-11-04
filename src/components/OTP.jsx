import React from "react";
import { useState } from "react";

function OTP() {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };
  console.log(otp[0]);

  return (
    <>
      <div className="flex justify-center py-10 ">
        <form>
          <div>
            <label className=" ">Enter OTP:</label>
            <br />
            <div className="mt-2">
              {otp.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className=""
                  value={otp[index]}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  style={{
                    width: "40px",
                    height: "40px",
                    margin: "0 5px",
                    textAlign: "center",
                    fontSize: "18px",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center ">
            <button
              type="submit"
              className="border-2 px-5 py-2 mt-5 text-white bg-blue-500 rounded-sm hover:bg-white hover:text-blue-600 hover:font-bold hover:rounded-lg "
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default OTP;
