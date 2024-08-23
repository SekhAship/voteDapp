import React from 'react'

const Connected = (props) => {
  return (
    <div className='login-container'>
      <div className='welcome-message'>Account connected successfully</div>
      <div className='account-info'>Account: {props.account}</div>
      <div className='remaining-time'>Remaining Time: {props.remainingTime}</div>
      {props.CanVote?(
        <p className='welcome-message'>you have already voted</p>
        
      ):(

        <div>

<div className='input-group'>
  <input
    type='number'
    placeholder='Enter candidate index'
    value={props.number}
    onChange={props.handleNumberChange}
    className='input-field'
  />
  <button className='vote-button' onClick={props.votefunction}>
    Vote
  </button>
</div>


        </div>
      )}

<div className='candidates-table'>
  <table>
    <thead>
      <tr>
        <th>Index</th>
        <th>Candidate</th>
        <th>Votes</th>
      </tr>
    </thead>
    <tbody>
      {props.candidates.map((candidate, index) => {
        return (
          <tr key={candidate.id} className='candidate-row'>
            <td>{index}</td>
            <td>{candidate.name}</td>
            <td>{candidate.voteCount}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

    </div>

  )
}

export default Connected
