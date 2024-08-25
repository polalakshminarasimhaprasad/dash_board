import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddWidget from './AddWidget';
import { removeWidget, removeCategory } from '../features/widgetsSlice';
import './Dashboard.css';
import Widget from './Widget';

const Dashboard = () => {
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useSelector((state) => state.widgets.categories);
  const dispatch = useDispatch();

  const handleRemove = (category, widgetName) => {
    dispatch(removeWidget({ category, widgetName }));
  };

  const handleRemoveCategory = (category) => {
    if (window.confirm(`Are you sure you want to remove the category "${category}" and all its widgets?`)) {
      dispatch(removeCategory({ category }));
    }
  };

  const handleToggleAddWidget = (category) => {
    setCurrentCategory(category);
    setShowAddWidget(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddWidgetFromSearch = () => {
    setCurrentCategory(null); 
    setShowAddWidget(true);
  };

  const filteredCategories = Object.keys(categories).filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    categories[category].some((widget) => widget.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="dashboard">
      <div className="search-and-add">
        <input
          type="text"
          className="search-input"
          placeholder="Search widgets or categories..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button 
          onClick={handleAddWidgetFromSearch} 
          className="add-widget-button"
        >
          Add Widget
        </button>
      </div>
      {filteredCategories.map((category) => (
        <div key={category} className="category">
          <div className="category-header">
            <h2>{category}</h2>
            <button 
              onClick={() => handleRemoveCategory(category)} 
              className="remove-category-button"
            >
              Remove Category
            </button>
          </div>
          <div className="widgets">
            {categories[category]
              .filter((widget) => widget.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((widget, index) => (
                <Widget
                  key={index}
                  category={category}
                  widget={widget}
                  onRemove={handleRemove}
                />
              ))}
          </div>
          <button 
            onClick={() => handleToggleAddWidget(category)} 
            className="add-widget-button"
          >
            Add Widget to {category}
          </button>
        </div>
      ))}

      {showAddWidget && (
        <div className="modal-overlay">
          <AddWidget category={currentCategory} onClose={() => setShowAddWidget(false)} />
        </div>
      )}
    </div>
  );
};
export default Dashboard;