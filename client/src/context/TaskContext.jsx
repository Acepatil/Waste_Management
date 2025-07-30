/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

const TaskContext = createContext();

const initialState = {
  isLoading: false,
  allcomplaints: [],
  pending: [],
  completed: [],
  mapCenter: [58.09, -0.09], // Default center position,
  yourCenter: [null, null],
};

function reducer(state, action) {
  switch (action.type) {
    case "waste/add":
      return {
        ...state,
        pending: [...state.pending, action.payload],
        allcomplaints: [...state.allcomplaints, action.payload],
      };

      case "waste/update/comp":{
        const updatedCompleted = state.completed.filter(complaint => complaint.task_id!==action.payload);
        return {
          ...state,
          completed: updatedCompleted,
        };
      }

      case "waste/update/pend":{
        const updatedPending = state.pending.filter(complaint => complaint.task_id!==action.payload);
        return {
          ...state,
          pending: updatedPending,
        };
      }

    case "waste/listadd":
      return {
        ...state,
        allcomplaints: action.payload,
      };

    case "waste/listpend":
      return {
        ...state,
        pending: action.payload,
      };

      case "waste/listcomp":
        return {
          ...state,
          completed: action.payload,
        };

    case "waste/completed":
      return {
        ...state,
        allcomplaints: [...state.allcomplaints, action.payload],
        completed: [...state.completed, action.payload],
      };

    case "map/setCenter":
      return {
        ...state,
        mapCenter: action.payload,
      };

    case "map/yourCenter":
      return {
        ...state,
        yourCenter: action.payload,
      };

    default:
      return state;
  }
}



function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleLocationClick = (lat, lng) => {
    dispatch({ type: 'map/setCenter', payload: [lat, lng] });
  };

  return (
    <TaskContext.Provider value={{ ...state, handleLocationClick,dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}

export { TaskProvider, useTask };
