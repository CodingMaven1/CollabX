import axios from "../../axios/axios";

export const fetchUser =  () => async (dispatch) => {
    const user = await axios.get('/users/currentuser')

    dispatch({
        type: 'FETCH_USER',
        payload: user.data
    })
}