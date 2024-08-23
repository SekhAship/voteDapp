import { ethers } from 'ethers';
import './App.css';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import Connected from './components/Connected';
import { contractAddress, contactAbi } from './constants/Constant';
import Finished from './components/Finished';


function App() {
  // const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  // const [address, setAddress] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [votingStatus, setVotingStatus] = useState(true)
  const [remainingTime, setRemainingTime] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [number, setNumber] = useState('')
  const [CanVote, setCanVote] = useState(true)


  useEffect(() => {
    getCandidates();
    getCurrentStatus();
    getRemainingTime();
    if(window.ethereum) {
      window.ethereum.on('accountsChanged', handleAcountsChanged);
    }
    return () => {
      if(window.ethereum) {
        window.ethereum.off('accountsChanged', handleAcountsChanged);
      }
    }
  }
  );

  function handleAcountsChanged(accounts) {
    if(accounts.length > 0&&accounts!==accounts[0]) {

      setAccount(accounts[0]);
      canVote();
    }else {
      setAccount(null);
      setIsConnected(false);
    }
  }

  async function getCurrentStatus() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,contactAbi,signer
    );
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,contactAbi,signer
    );
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time,16));
  }

  async function canVote() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,contactAbi,signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  async function vote() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,contactAbi,signer
    );
    const tx = await contractInstance.vote(number);
    await tx.wait();
    
    canVote();
  }

  async function getCandidates() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,contactAbi,signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandidates();
    // console.log("candidatelist: ",candidatesList); 
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        id: index,
        name: candidate.name,
        voteCount: Number(candidate.voteCount)
      }
    }
    );
    setCandidates(formattedCandidates); 
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }


  async function connectWallet() {
    if(window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);

        const signer = await provider.getSigner();
        const address = await signer.getAddress();
       
        setAccount(address);
        console.log("Metamask connected ",address);
        setIsConnected(true);
      } catch (error) {
        console.log(error)  
      }
    }
    else {
      alert('Please install MetaMask!')
    }
  }

  return (
    <div className="App">

      {true?(
              (isConnected?(
                <Connected account={account}
                candidates={candidates}
                remainingTime={remainingTime}
                number={number}
                handleNumberChange={handleNumberChange}
                votefunction={vote}
                CanVote={CanVote}
                />
                
              ):(
        
                <Login
              connectWallet={connectWallet}
              />
              ))
      ):(
        <Finished/>
      )}


      

    </div>
  );
}

export default App;
