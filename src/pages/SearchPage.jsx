import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
// CORRECTED: Import the function getAndInitializeFoodItems instead of the static array
import { restaurants, getAndInitializeFoodItems } from '../data/mockData';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const restaurant = restaurants[0]; // Get your single restaurant

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get('q');
    if (!searchQuery) {
      navigate('/');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      
      // CORRECTED: Call the function to get the most up-to-date food list
      const allFoodItems = getAndInitializeFoodItems();
      
      // Now, filter the up-to-date list
      const matchedFoods = allFoodItems.filter(food => 
        food.restaurantId === restaurant.id && (
          food.name.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query) ||
          food.category.toLowerCase().includes(query)
        )
      );

      setSearchResults(matchedFoods);
      setLoading(false);
    }, 500);
  }, [location.search, navigate, restaurant.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Searching...
            </h1>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <LoadingSkeleton key={n} type="card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const query = new URLSearchParams(location.search).get('q');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Search Results for "{query}"
        </h1>

        {searchResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Menu Items from {restaurant.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(food => (
                <FoodCard 
                  key={food.id} 
                  food={food} 
                  cardSize="medium"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try different search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;