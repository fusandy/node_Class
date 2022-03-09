// import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import {IMG_PATH, UPLOAD_AVATAR} from './config';
import axios from 'axios';

function App() {

  let [imgSrc, setImgSrc] = useState('');

  const doUpload = async ()=>{
    const fd = new FormData(document.fake_form);
    const r = await axios.post(UPLOAD_AVATAR, fd);

    console.log(r.data);
    setImgSrc(IMG_PATH + '/' + r.data.filename);
  };

  return <>
    <form name="fake_form" onSubmit={(e)=>e.preventDefault()}>
      <img src={imgSrc} alt="" width="300px" id="img01" />
      <input type="file" id="avatar" name="avatar" />

      <div className="mb-3">
        <label htmlFor="my_img" className="form-label">image</label>
        <input type="text" className="form-control" id="my_img" name="my_img" />
      </div>

      <button type="submit" className="btn btn-primary" onClick={doUpload}>Submit</button>
    </form>

  </>;

}

export default App;
