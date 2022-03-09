// import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import {ADDRESS_BOOK_LIST} from './config';
import asiox from 'axios';

function App() {

  let [data, setData] = useState({});
  let [totalRows, setTotalRows] = useState(0);

  useEffect( ()=>{

    (async()=>{
      let r = await asiox.get(ADDRESS_BOOK_LIST);
      console.log(r);
      if(r.status===200){
        setTotalRows(r.data.totalRows);
        setData(r.data);
      }
    })();

  }, []);


  return <>
    <h1>Hello {totalRows}</h1>
    <table>
      <tbody>
      { data.rows ? data.rows.map(el => {
        return (
            <tr key={el.sid}>
              <td>{el.sid}</td>
              <td>{el.name}</td>
              <td>{el.email}</td>
              <td>{el.mobile}</td>
              <td>{dayjs(el.birthday).format('YYYY-MM-DD')}</td>
              <td>{el.address}</td>
            </tr>);
      }) : <tr><td></td></tr> }
      </tbody>
    </table>
  </>;

}

export default App;
