import NavBar from "../navbar/navbar"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export default function Donate() {
    const account = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
      if (account.status === 'disconnected') {
        navigate('/')
      }
    }, [account.status]);
    
  return (
    <main>
      <NavBar />
      <div>
        oiiii!
      </div>
    </main>
  )
}
