import React, { useState, useMemo } from 'react';
import { PropertyListing, propertyListingsService } from '@/services/propertyListingsService';
import { PropertyListingCard } from './PropertyListingCard';
import { Filter, SortAsc, SortDesc, Grid, List, Map, BarChart3, Home, Building, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertySearchResultsProps {
  results: PropertyListing[];
  query?: string;
  className?: string;
  showHeader?: boolean;
}

type ViewMode = 'grid' | 'list' | 'map';
type SortOption = 'price-asc' | 'price-desc' | 'date-desc' | 'bedrooms-desc' | 'type';

export const PropertySearchResults: React.FC<PropertySearchResultsProps> = ({
  results,
  query = '',
  className = '',
  showHeader = true
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'rent'>('all');
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);

  // Sort and filter results
  const processedResults = useMemo(() => {
    let filtered = results;

    // Filter by listing type
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.listingType === filterType);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'date-desc':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'bedrooms-desc':
          return b.bedrooms - a.bedrooms;
        case 'type':
          return a.propertyType.localeCompare(b.propertyType);
        default:
          return 0;
      }
    });

    return filtered;
  }, [results, filterType, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const sales = results.filter(p => p.listingType === 'sale');
    const rentals = results.filter(p => p.listingType === 'rent');

    return {
      total: results.length,
      sales: sales.length,
      rentals: rentals.length,
      avgSalePrice: sales.length > 0 ? Math.round(sales.reduce((sum, p) => sum + p.price, 0) / sales.length) : 0,
      avgRentPrice: rentals.length > 0 ? Math.round(rentals.reduce((sum, p) => sum + p.price, 0) / rentals.length) : 0,
      propertyTypes: [...new Set(results.map(p => p.propertyType))].length,
      areas: [...new Set(results.map(p => p.postcode.split(' ')[0]))].length,
    };
  }, [results]);

  const handlePropertyClick = (property: PropertyListing) => {
    setSelectedProperty(property);
    // In a real app, this might navigate to a detailed property page
  };

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'price-asc': return 'Price: Low to High';
      case 'price-desc': return 'Price: High to Low';
      case 'date-desc': return 'Newest First';
      case 'bedrooms-desc': return 'Most Bedrooms';
      case 'type': return 'Property Type';
      default: return 'Sort';
    }
  };

  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
        <p className="text-gray-500">
          {query ? `No results for "${query}". Try adjusting your search criteria.` : 'Start a search to see results here.'}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <>
          {/* Header with query and stats */}
          <div className="mb-6">
            {query && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  Showing {processedResults.length} properties for "{query}"
                </p>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">For Sale</p>
                    <p className="text-2xl font-bold text-green-600">{stats.sales}</p>
                    {stats.avgSalePrice > 0 && (
                      <p className="text-xs text-gray-500">
                        Avg: £{stats.avgSalePrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Home className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">To Rent</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.rentals}</p>
                    {stats.avgRentPrice > 0 && (
                      <p className="text-xs text-gray-500">
                        Avg: £{stats.avgRentPrice.toLocaleString()} pcm
                      </p>
                    )}
                  </div>
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Property Types</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.propertyTypes}</p>
                    <p className="text-xs text-gray-500">{stats.areas} areas</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
            {/* Filter by listing type */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Show:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                {(['all', 'sale', 'rent'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 text-sm font-medium ${
                      filterType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'sale' ? 'Sale' : 'Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="bedrooms-desc">Most Bedrooms</option>
                <option value="type">Property Type</option>
              </select>
            </div>

            {/* View mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 ${
                  viewMode === 'map' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Map View"
                disabled
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Results */}
      <div className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}>
        {processedResults.map((property) => (
          <PropertyListingCard
            key={property.id}
            property={property}
            onViewDetails={handlePropertyClick}
            className={`${viewMode === 'list' ? 'md:flex md:max-w-none' : ''} hover:shadow-lg transition-shadow`}
          />
        ))}
      </div>

      {/* Load more / Pagination could go here */}
      {processedResults.length > 12 && (
        <div className="text-center mt-8">
          <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
            <Eye className="w-4 h-4 mr-2" />
            View More Properties
          </Button>
        </div>
      )}
    </div>
  );
};