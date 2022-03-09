// import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';

function App() {

    let [data, setData] = useState({});
    let [totalRows, setTotalRows] = useState(0);

    useEffect( ()=>{

        (async()=>{
            let r = await fetch('http://localhost:3001/address-book/api/list');
            let j = await r.json();
            if(j.totalRows){
                setTotalRows(j.totalRows);
                setData(j);
            }
        })();

    }, []);


    return <>
        <h1>Hello {totalRows}</h1>
        <table>
            { data.rows ? data.rows.map(el => {
                return <tr>
                    <td>{el.sid}</td>
                    <td>{el.name}</td>
                    <td>{el.email}</td>
                    <td>{el.mobile}</td>
                    <td>{dayjs(el.birthday).format('YYYY-MM-DD')}</td>
                    {/* <td>{el.birthday}</td> */}
                    <td>{el.address}</td>
                </tr>;
            }) : '' }
        </table>
    </>;

}

export default App;
