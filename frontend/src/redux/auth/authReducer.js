const INITIAL_STATE = {
    authuser: ""
}

const authReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'FETCH_USER':
            return{
                ...state,
                authuser: action.payload
            }
        default:
            return state;
    }
}

export default authReducer;