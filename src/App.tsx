import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

function App() {
  const [step, setStep] = useState(1);
  const [pk, setPk] = useState("");
  const [mints, setMints] = useState("");
  if (step === 1) {
    return (
      <Step1
        next={() => {
          setStep(2);
        }}
        setPk={setPk}
      />
    );
  }
  if (step === 2) {
    return (
      <Step2
        next={() => {
          setStep(3);
        }}
        setMints={setMints}
      />
    );
  }
  if (step === 3) {
    return (
      <Step3
        pk={pk}
        mints={mints}
        next={() => {
          setStep(4);
        }}
        back={() => {
          setStep(2);
        }}
      />
    );
  }
  if (step === 4) {
    return <Step4 />;
  }
}

export default App;
