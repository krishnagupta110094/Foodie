import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  user:localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")):null,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, actions) {
      state.signupData = actions.payload;
    },
    setLoading(state, actions) {
      state.loading = actions.payload;
    },
    setToken(state, actions) {
      state.token = actions.payload;
    },
    setUser(state,actions){
      state.user = actions.payload;
    }
  },
});

export const { setSignupData, setLoading, setToken ,setUser} = authSlice.actions;

export default authSlice.reducer;