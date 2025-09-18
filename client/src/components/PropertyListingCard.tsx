import React from 'react';
import { PropertyListing, propertyListingsService } from '@/services/propertyListingsService';
import { Bed, Bath, MapPin, Tag, Calendar, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyListingCardProps {
  property: PropertyListing;
  className?: string;
  onViewDetails?: (property: PropertyListing) => void;
}

export const PropertyListingCard: React.FC<PropertyListingCardProps> = ({
  property,
  className = '',
  onViewDetails
}) => {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.address}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTIwVjE4MEgyNDBWMjQwSDI2MFYyMDBIMzAwVjE4MEgyNDBWMTIwSDIwMFoiIGZpbGw9IiM5Q0E5QjciLz4KPHRleHQgeD0iMjAwIiB5PSIyNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+UHJvcGVydHkgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p>Property Image</p>
            </div>
          </div>
        )}

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            property.listingType === 'sale'
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white'
          }`}>
            {property.listingType === 'sale' ? 'FOR SALE' : 'TO LET'}
          </span>
        </div>

        {/* Property Type */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-semibold bg-black/70 text-white rounded-full">
            {propertyListingsService.getPropertyTypeLabel(property.propertyType)}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <span className="text-2xl font-bold text-purple-600">
            {propertyListingsService.formatPrice(property.price, property.listingType)}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">{property.address}</p>
            <p className="text-sm text-gray-600">{property.postcode}</p>
          </div>
        </div>

        {/* Bed/Bath Info */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
            </span>
          </div>
          {property.tenure && (
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 capitalize">{property.tenure}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {property.description}
        </p>

        {/* Features */}
        {property.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Agent & Date */}
        <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{property.agent.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(property.dateAdded)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleViewDetails}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Phone className="w-3 h-3" />
            Call
          </Button>
        </div>
      </div>
    </div>
  );
};