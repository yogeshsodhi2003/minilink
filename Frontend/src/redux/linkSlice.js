import { createSlice } from "@reduxjs/toolkit";

const linksSlice = createSlice({
  name: "links",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLinks(state, action) {
      state.data = action.payload;
    },
    addLink(state, action) {
      state.data.unshift(action.payload);
    },
    deleteLink(state, action) {
      state.data = state.data.filter(link => link._id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setLinks, addLink, deleteLink, setLoading, setError } = linksSlice.actions;
export default linksSlice.reducer;
