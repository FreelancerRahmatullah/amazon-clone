import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useStateValue } from '../state/StateProvider';

function ProductDetails({ allProducts }) {
    const { id } = useParams();
    const [{}, dispatch] = useStateValue();
    
    // String conversion ensures matching regardless of ID type (Number/String)
    const product = allProducts?.find(item => String(item.id) === id);

    if (!product) return (
        <div className="p-20 text-center flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-600">Product not found!</h2>
            <p className="text-gray-400">The product you're looking for doesn't exist or is loading.</p>
        </div>
    );

    // ইমেজ অ্যারে বা স্ট্রিং যাই হোক প্রথমটি নেওয়া
    const displayImage = Array.isArray(product.image) ? product.image[0] : (product.image || product.thumbnail);
    const starCount = Math.round(Number(product.rating)) || 5;

    const addToBasket = () => {
        dispatch({
            type: "ADD_TO_BASKET",
            item: { 
                id: product.id,
                title: product.title,
                price: Number(product.price),
                description: product.description,
                image: displayImage,
                rating: starCount
            }
        });
    };

    return (
        <div className="bg-white min-h-screen p-5 md:p-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
                {/* বাম পাশ: ইমেজ */}
                <div className="flex-1 border p-5 rounded-lg shadow-sm bg-gray-50">
                    <img 
                        src={displayImage} 
                        alt={product.title} 
                        className="w-full h-[400px] object-contain hover:scale-105 transition-transform duration-300" 
                    />
                </div>

                {/* ডান পাশ: তথ্য */}
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
                    <p className="text-gray-500 italic bg-gray-100 inline-block px-2 py-1 rounded text-sm uppercase">
                        {product.category}
                    </p>
                    
                    <div className="flex text-yellow-500">
                        {[...Array(Math.min(5, starCount))].map((_, i) => (
                            <Star key={`star-${i}`} size={20} fill="currentColor" />
                        ))}
                        {[...Array(5 - Math.min(5, starCount))].map((_, i) => (
                            <Star key={`gray-star-${i}`} size={20} className="text-gray-300" />
                        ))}
                    </div>

                    <div className="border-t border-b py-4">
                        <span className="text-3xl font-bold text-red-600">${Number(product.price).toLocaleString()}</span>
                        <p className="text-green-600 font-semibold mt-2 italic flex items-center">
                            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                            In Stock & Ready to Ship
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2">About this item:</h3>
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    <button 
                        onClick={addToBasket}
                        className="bg-[#ffd814] hover:bg-[#f7ca00] active:scale-95 w-full md:w-64 py-3 rounded-full font-bold flex items-center justify-center space-x-2 shadow-md transition-all duration-150"
                    >
                        <ShoppingCart size={20} />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
