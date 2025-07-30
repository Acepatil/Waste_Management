/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer, useEffect } from "react";

const UserContext = createContext();

const initialState = {
  username: "",
  password: "",
  email: "",
  isUser: true,
  isLogged: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        username: action.payload.username,
        password: "",
        isLogged: true,
      };

    case "register":
      return {
        ...state,
        email: action.payload.email,
        username: action.payload.username,
        password: action.payload.password,
      };
    case "logout":
      return initialState;

    case "admin":
      return {
        ...state,
        isUser: false,
      };

    case "user":
      return {
        ...state,
        isUser: true,
      };
    case "admin/register":
      return {
        ...state,
        email: action.payload.email,
        username: action.payload.username,
        password: action.payload.password,
        isUser: false,
      };

    case "admin/login":
      return {
        ...state,
        username: action.payload.username,
        password: "",
      };

    default:
      return state;
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const localData = localStorage.getItem("userState");
    return localData ? JSON.parse(localData) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("userState", JSON.stringify(state));
  }, [state]);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUser };
