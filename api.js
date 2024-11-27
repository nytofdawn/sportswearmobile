import axios from "axios";


export const login =()=> {
    response= axios.post('localhost:8000/login.php');
}