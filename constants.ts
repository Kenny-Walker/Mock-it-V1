
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 't-shirt',
    name: 'T-Shirt',
    description: 'A classic cotton t-shirt, perfect for any design.',
    placements: [
        { id: 'center-chest', name: 'Center Chest', description: 'The logo is placed in the center of the chest area.'},
        { id: 'left-pocket', name: 'Left Pocket', description: 'A smaller version of the logo is placed on the left pocket area.'},
        { id: 'full-front', name: 'Full Front', description: 'A large version of the logo covers most of the front of the shirt.'}
    ]
  },
  {
    id: 'mug-ceramic',
    name: 'Ceramic Mug',
    description: 'A sturdy and stylish ceramic mug for coffee or tea.',
    placements: [
        { id: 'front-center', name: 'Front and Center', description: 'The logo is placed on one side of the mug, facing outwards.'},
        { id: 'wrap-around', name: 'Wrap-around', description: 'The logo is printed to wrap around the mug.'}
    ]
  },
  {
    id: 'cap',
    name: 'Baseball Cap',
    description: 'A sleek baseball cap with an adjustable strap.',
    placements: [
        { id: 'front-panel', name: 'Front Panel', description: 'The logo is embroidered on the main front panel of the cap.'},
        { id: 'side-panel', name: 'Side Panel', description: 'A smaller logo is placed on the side of the cap.'}
    ]
  },
  {
    id: 'tote-bag-canvas',
    name: 'Canvas Tote Bag',
    description: 'An eco-friendly canvas tote bag, great for shopping.',
    placements: [
        { id: 'center', name: 'Center', description: 'The logo is placed in the middle of the tote bag.'},
        { id: 'high-center', name: 'High Center', description: 'The logo is placed on the upper half of the tote bag.'}
    ]
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    description: 'A comfortable hoodie for a casual look.',
    placements: [
        { id: 'center-chest', name: 'Center Chest', description: 'The logo is placed in the center of the chest.'},
        { id: 'back-center', name: 'Back Center', description: 'A large logo is placed in the center of the back.'}
    ]
  },
];
