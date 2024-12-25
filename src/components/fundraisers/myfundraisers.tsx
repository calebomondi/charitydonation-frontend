import NavBar from "../navbar/navbar"
import { CreateCampaignForm } from "./createform"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export default function MyFundraisers() {
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
        <CreateCampaignForm />
    </main>
  )
}
