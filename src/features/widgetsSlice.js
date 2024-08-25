import { createSlice } from '@reduxjs/toolkit';

const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('widgetsState');
    if (serializedState === null) {
      return {
        categories: {
          'CSPM': ['Cloud Accounts', 'Cloud Account Risk Assessment'],
          'CWPP': ['Top 5 Namespace Specific Alerts', 'Workload Alerts'],
          'Image': ['Image Risk Assessment', 'Image Security Issues'],
          'Ticket': ['Ticket Overview', 'Open Tickets']
        }
      };
    }
    const parsedState = JSON.parse(serializedState);

    if (parsedState && parsedState.categories) {
      return parsedState;
    } else {
      return {
        categories: {
          'CSPM': ['Cloud Accounts', 'Cloud Account Risk Assessment'],
          'CWPP': ['Top 5 Namespace Specific Alerts', 'Workload Alerts'],
          'Image': ['Image Risk Assessment', 'Image Security Issues'],
          'Ticket': ['Ticket Overview', 'Open Tickets']
        }
      };
    }
  } catch (err) {
    console.error('Failed to load state from local storage:', err);
    return {
      categories: {
        'CSPM': ['Cloud Accounts', 'Cloud Account Risk Assessment'],
        'CWPP': ['Top 5 Namespace Specific Alerts', 'Workload Alerts'],
        'Image': ['Image Risk Assessment', 'Image Security Issues'],
        'Ticket': ['Ticket Overview', 'Open Tickets']
      }
    };
  }
};

const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('widgetsState', serializedState);
  } catch (err) {
    console.error('Failed to save state to local storage:', err);
  }
};

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState: loadStateFromLocalStorage(),
  reducers: {
    addWidget: (state, action) => {
      const { category, widget } = action.payload;
      if (!state.categories[category]) {
        state.categories[category] = [];  
      }
      state.categories[category].push(widget);  
      saveStateToLocalStorage(state);
    },
    removeWidget: (state, action) => {
      const { category, widgetName } = action.payload;
      if (state.categories[category]) {
        state.categories[category] = state.categories[category].filter(widget => widget.name !== widgetName);
        saveStateToLocalStorage(state);
      }
    },
    addCategory: (state, action) => {
      const { category } = action.payload;
      if (!state.categories[category]) {
        state.categories[category] = []; 
        saveStateToLocalStorage(state);
      }
    },
    removeCategory: (state, action) => {
      const { category } = action.payload;
      if (state.categories[category]) {
        delete state.categories[category];  
        saveStateToLocalStorage(state);
      }
    }
  },
});

export const { addWidget, removeWidget, addCategory, removeCategory } = widgetsSlice.actions;

export default widgetsSlice.reducer;