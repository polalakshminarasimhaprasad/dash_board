import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addWidget, addCategory } from '../features/widgetsSlice';
import './AddWidget.css';

const AddWidget = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState('CSPM');
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newWidget, setNewWidget] = useState('');
  const [availableWidgets, setAvailableWidgets] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    const storedWidgets = JSON.parse(localStorage.getItem('availableWidgets')) || {
      CSPM: ['Cloud Accounts', 'Cloud Account Risk Assessment'],
      CWPP: ['Top 5 Namespace Specific Alerts', 'Workload Alerts'],
      Image: ['Image Risk Assessment', 'Image Security Issues'],
      Ticket: ['Ticket Overview', 'Open Tickets'],
    };
    setAvailableWidgets(storedWidgets);
  }, []);

  const saveWidgetsToLocalStorage = (widgets) => {
    localStorage.setItem('availableWidgets', JSON.stringify(widgets));
  };

  const handleWidgetSelection = (widget) => {
    setSelectedWidgets((prevSelectedWidgets) =>
      prevSelectedWidgets.includes(widget)
        ? prevSelectedWidgets.filter((w) => w !== widget)
        : [...prevSelectedWidgets, widget]
    );
  };

  const handleAddWidget = () => {
    if (newCategory && !availableWidgets[newCategory]) {
      dispatch(addCategory({ category: newCategory }));
      setSelectedTab(newCategory);
      setNewCategory('');
    }
    if (newWidget && availableWidgets[selectedTab]) {
      dispatch(addWidget({ category: selectedTab, widget: { name: newWidget, text: '' } }));
      setNewWidget('');
    }
    selectedWidgets.forEach((widget) => {
      dispatch(addWidget({ category: selectedTab, widget: { name: widget, text: '' } }));
    });

    setSelectedWidgets([]);
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategory && !availableWidgets[newCategory]) {
      const updatedWidgets = {
        ...availableWidgets,
        [newCategory]: [],
      };
      setAvailableWidgets(updatedWidgets);
      saveWidgetsToLocalStorage(updatedWidgets);
      setSelectedTab(newCategory);
      setNewCategory('');
    }
  };

  const handleAddNewWidget = () => {
    if (newWidget && availableWidgets[selectedTab]) {
      const updatedWidgets = {
        ...availableWidgets,
        [selectedTab]: [...availableWidgets[selectedTab], newWidget],
      };
      setAvailableWidgets(updatedWidgets);
      saveWidgetsToLocalStorage(updatedWidgets);
      setNewWidget('');
    }
  };

  const handleRemoveCategory = (category) => {
    if (availableWidgets[category]) {
      const updatedWidgets = { ...availableWidgets };
      delete updatedWidgets[category];

      setAvailableWidgets(updatedWidgets);
      saveWidgetsToLocalStorage(updatedWidgets);

      if (selectedTab === category) {
        setSelectedTab(Object.keys(updatedWidgets)[0] || '');
      }
    }
  };

  const handleRemoveWidget = (widget) => {
    if (availableWidgets[selectedTab]?.includes(widget)) {
      const updatedWidgets = {
        ...availableWidgets,
        [selectedTab]: availableWidgets[selectedTab].filter((w) => w !== widget),
      };

      setAvailableWidgets(updatedWidgets);
      saveWidgetsToLocalStorage(updatedWidgets);
    }
  };

  return (
    <div className="add-widget">
      <div className="header">
        <h3>Add Widget</h3>
        <button className="close-button" onClick={onClose}>
          &times; {/* HTML entity for "X" */}
        </button>
      </div>
      <div className="tabs">
        {Object.keys(availableWidgets).map((tab) => (
          <button
            key={tab}
            className={`tab ${selectedTab === tab ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
            <span
              className="remove-button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveCategory(tab);
              }}
              title={`Remove ${tab}`}
            >
              &times;
            </span>
          </button>
        ))}
      </div>
      <div className="widget-options">
        {availableWidgets[selectedTab]?.map((widget) => (
          <div key={widget} className="widget-option">
            <input
              type="checkbox"
              id={widget}
              checked={selectedWidgets.includes(widget)}
              onChange={() => handleWidgetSelection(widget)}
            />
            <label htmlFor={widget}>{widget}</label>
            <button
              className="remove-widget-button"
              onClick={() => handleRemoveWidget(widget)}
              title={`Remove ${widget}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="actions">
        <button className="cancel-button" onClick={() => setSelectedWidgets([])}>
          Cancel
        </button>
        <button className="confirm-button" onClick={handleAddWidget}>
          Confirm
        </button>
      </div>
      <div className="add-category-widget">
        <h4>Add New Category</h4>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <div className="add-category-widget">
        <h4>Add New Widget to {selectedTab}</h4>
        <input
          type="text"
          value={newWidget}
          onChange={(e) => setNewWidget(e.target.value)}
          placeholder="New Widget Name"
        />
        <button onClick={handleAddNewWidget}>Add Widget</button>
      </div>
    </div>
  );
};
export default AddWidget;