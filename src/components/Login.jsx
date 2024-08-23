import React from 'react'

const Login = (props) => {
  return (
    <div className='login-container'>
    <div className='welcome-message1'>Welcome to Voting Dapp</div>
    <button className='login-button' onClick={props.connectWallet}>Connect Wallet</button>
    </div>

  )
}

export default Login
