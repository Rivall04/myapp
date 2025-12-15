import React, {useEffect, useState} from 'react';
export default function App(){
	  const [msg,setMsg]=useState('loading...');
	  useEffect(()=>{
		      fetch(`${process.env.REACT_APP_API_URL || '/api'}/hello`)
		        .then(r=>r.json()).then(d=>setMsg(JSON.stringify(d))).catch(e=>setMsg('error:'+e));
		    },[]);
	  return <div style={{padding:20,fontFamily:'sans-serif'}}>
		    <h1>MyApp Frontend</h1>
		    <pre>{msg}</pre>
		  </div>;
}

