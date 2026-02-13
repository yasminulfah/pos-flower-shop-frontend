function ProductGrid({ products, addToCart }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-2 bg-white p-6 rounded-lg shadow-md text-center">
        No products available.
      </div>
    );
  }

  return (
    <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => {
          if (!product.variants || product.variants.length === 0) return null;

          return product.variants.map((variant) => {
            const imageUrl = variant.detail_image;

            return (
              <button
                key={variant.id}
                onClick={() => addToCart(product, variant)}
                className="p-4 rounded-lg hover:border-pink-500 hover:shadow-lg transition flex flex-col items-center"
              >
                <img
                  src={imageUrl}
                  alt={variant.variant_name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <div className="font-semibold text-center text-sm w-full">
                  {product.product_name} - {variant.variant_name}
                </div>
                <p className="text-pink-600 font-bold text-center">
                  Rp {Number(variant.price).toLocaleString('id-ID')}
                </p>
                <p className="text-gray-500 text-xs text-center">
                  Stock: {variant.stock}
                </p>
              </button>
            );
          });
        })}
      </div>
    </div>
  );
}
export default ProductGrid;