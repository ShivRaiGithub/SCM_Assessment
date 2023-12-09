import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);

  const [totalParticipants, setTotalParticipants]=useState(undefined);
  const [totalFunds, setTotalFunds]=useState(undefined);
  const [userDonation, setUserDonation]=useState(undefined);

  const contractAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getTotalParticipants = async() => {
    if (atm) {
      setTotalParticipants((await atm.getTotalParticipants()).toNumber());
    }
  }
  const getTotalFunds = async() => {
    if (atm) {
      setTotalFunds((await atm.getTotalFunds()).toNumber());
    }
  }
  const getUserDonations = async() => {
    if (atm) {
      setUserDonation((await atm.getUserDonations()).toNumber());
    }
  }

  const donate = async() => {
    if (atm) {
      let tx = await atm.donate();
      await tx.wait();
      getTotalFunds();
      getTotalParticipants();
      getUserDonations();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (totalFunds == undefined || totalParticipants==undefined || userDonation==undefined) {
      getTotalFunds();
      getTotalParticipants();
      getUserDonations()
    }

    return (
      <div>
        <p>Your Contribution: {userDonation}</p>
        <p>Total Contribution: {totalFunds}</p>
        <p>Total Participants: {totalParticipants}</p>
        <button onClick={() => donate()}>Donate an ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Fundraiser</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
