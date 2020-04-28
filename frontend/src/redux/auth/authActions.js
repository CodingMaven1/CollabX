import axios from "axios";

export const fetchUser = async () => {
    const user = await axios.get('/users/currentuser')

    return{
        type: 'FETCH_USER',
        payload: user
    }
}