import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';
import config from './Config'
import { BrowserRouter as Router, Route, Link, Switch, useLocation } from "react-router-dom"

function App() {
  const [data, setData] = useState({});
  // const {page} = useParams()
  const location = useLocation()
  console.log(location.search)
  

  // 資料形式
  // {
  //   perPage: 10,
  //   page: 1,
  //   totalRows: 131,
  //   totalPages: 14,
  //   rows: [
  //   {
  //   sid: 1,
  //   name: "酷寶",
  //   email: "5781@gmail.com",
  //   mobile: "0918111222",
  //   birthday: "1990-05-04",
  //   address: "台南市",
  //   created_at: "2020-04-06T08:31:02.000Z",
  //   }
  // }

  // 將載入資料寫成function
  const getData = async (page=1) => {
      // const res = await fetch(config.AB_List)
      // const obj = await res.json()
      const obj = await (await fetch(config.AB_List+`?page=${page}`)).json()
      console.log(obj)
      setData(obj)
  }

  useEffect(()=>{
    getData()
  },[])

  // 判斷是否有拿到data
  const renderData = (data)=>{
    if(data.rows && data.rows.length){
      return data.rows.map( v => 
      <tr key={'data'+v.sid}>
        <th>{v.sid}</th>
        <td>{v.name}</td>
        <td>{v.email}</td>
        <td>{v.mobile}</td>
        <td>{v.birthday}</td>
      </tr>  )
    }else{
      return (
        <tr><th></th></tr>
      );
    }
  }

  return (

    <div className="App">
      <div className="container">
      {/* 判斷是否有獲得data */}
      { (data.rows && data.rows.length) ? 
        ( <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={data.page ===1 ? "disabled page-item" : "page-item"}>
              <a className="page-link" href="#/" onClick={()=>{ getData(data.page-1)}}>Previous</a>
            </li>
            {Array(data.totalPages).fill(1).map((v,i)=>{
              return (
                <li key={i} className={(data.page===i+1) ? 'page-item active' : "page-item"}>
                <a className="page-link" href="#/" onClick={()=>{getData(i+1)}}>{i+1}</a>
                </li>
                // Todo: a連結改寫成link to
              )
            })}
            <li className={data.page === data.totalPages ? "disabled page-item" : "page-item"}>
              <a className="page-link" href="#/" onClick={()=>{getData(data.page+1)}}>Next</a>
            </li>
          </ul>
        </nav> )
        : ''
      }
      </div>
      <div className='container'>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">name</th>
              <th scope="col">email</th>
              <th scope="col">mobile</th>
              <th scope="col">birthday</th>
            </tr>
          </thead>
          <tbody>
            {renderData(data)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
