
import React from 'react';
import { Product } from '../types';

interface ProductPlacementSelectorProps {
    products: Product[];
    selectedPlacements: Record<string, string[]>;
    onPlacementChange: (productId: string, placementId: string) => void;
}

const ProductPlacementSelector: React.FC<ProductPlacementSelectorProps> = ({ products, selectedPlacements, onPlacementChange }) => {
    return (
        <div className="space-y-6">
            {products.map((product, index) => (
                <div key={product.id} className={index > 0 ? "border-t border-gray-200 pt-6" : ""}>
                    <p className="font-semibold text-secondary text-lg mb-4">{product.name}</p>
                    <div>
                        <label className="font-medium text-sm text-gray-600 mb-2 block">Placements</label>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {product.placements.map(placement => (
                                <label key={placement.id} className="flex items-center space-x-2 cursor-pointer text-sm text-secondary hover:text-primary transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedPlacements[product.id]?.includes(placement.id) ?? false}
                                        onChange={() => onPlacementChange(product.id, placement.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-hover focus:ring-2 focus:ring-offset-1"
                                    />
                                    <span>{placement.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductPlacementSelector;
