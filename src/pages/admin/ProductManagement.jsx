import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../api/axios'; 

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    product_name: '',
    category_id: '', 
    description: '',
    main_image: null,
    variants: [
      { variant_name: '', price: '', stock: '', sku: '', detail_image: null }
    ]
  });
  
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products', error);
      alert('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;
    const newVariants = [...formData.variants];
    newVariants[index][name] = files ? files[0] : value;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariantRow = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { variant_name: '', price: '', stock: '', sku: '', detail_image: null }]
    }));
  };

  const removeVariantRow = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('product_name', formData.product_name);
    data.append('category_id', formData.category_id);
    data.append('description', formData.description);
    if (formData.main_image instanceof File) {
        data.append('main_image', formData.main_image);
    } else if (formData.main_image) {
    console.error("formData.main_image bukan objek File biner!");
  }
    
    // Append varian ke FormData
    formData.variants.forEach((variant, index) => {
      data.append(`variants[${index}][variant_name]`, variant.variant_name);
      data.append(`variants[${index}][price]`, variant.price);
      data.append(`variants[${index}][stock]`, variant.stock);
      data.append(`variants[${index}][sku]`, variant.sku);
      if (variant.detail_image instanceof File) {
        data.append(`variants[${index}][detail_image]`, variant.detail_image);
        }
    });
    
    if (editingId) data.append('_method', 'PUT');

    try {
      if (editingId) {
        await api.post(`/products/${editingId}`, data);
        alert('Produk berhasil diperbarui');
      } else {
        await api.post('/products', data);
        alert('Produk berhasil ditambahkan');
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error submitting form', error.response?.data);
      alert('Gagal menyimpan produk: ' + JSON.stringify(error.response?.data.errors));
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      product_name: product.product_name,
      category_id: product.category_id,
      description: product.description,
      main_image: null,

      variants: product.variants.map(v => ({
        id: v.id,
        variant_name: v.variant_name,
        price: v.price,
        stock: v.stock,
        sku: v.sku,
        detail_image: null 
      }))
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
        alert('Produk berhasil dihapus');
      } catch (error) {
        console.error('Error deleting product', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      product_name: '', 
      category_id: '',
      description: '',
      main_image: null,
      variants: [{ variant_name: '', price: '', stock: '', sku: '', detail_image: null }]
    });
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Product Management</h1>

      {/* Form Tambah/Edit */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-pink-700">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        {/* Input Data Utama Produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input type="text" name="product_name" value={formData.product_name} onChange={handleInputChange} placeholder="Product Name" className="border p-2 rounded" required />
          <input type="number" name="category_id" value={formData.category_id} onChange={handleInputChange} placeholder="Category ID" className="border p-2 rounded" required />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="border p-2 rounded col-span-2" />
          <div className="flex flex-col col-span-2">
            <label className="text-sm text-gray-600 mb-1">Main Image</label>
            <input type="file" name="main_image" onChange={handleInputChange} className="border p-1 rounded" accept="image/*" />
          </div>
        </div>

        {/* --- INPUT DATA VARIAN --- */}
        <h3 className="text-lg font-semibold mb-2">Variants</h3>
        {formData.variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-2 p-2 border rounded bg-gray-50 items-center">
            <input type="text" name="variant_name" value={variant.variant_name} onChange={(e) => handleVariantChange(index, e)} placeholder="Variant Name" className="border p-1 rounded text-sm" required />
            <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Price" className="border p-1 rounded text-sm" required />
            <input type="number" name="stock" value={variant.stock} onChange={(e) => handleVariantChange(index, e)} placeholder="Stock" className="border p-1 rounded text-sm" required />
            <input type="text" name="sku" value={variant.sku} onChange={(e) => handleVariantChange(index, e)} placeholder="SKU" className="border p-1 rounded text-sm" />
            <div className="flex gap-1">
              <input type="file" name="detail_image" onChange={(e) => handleVariantChange(index, e)} className="border p-1 rounded text-xs w-full" accept="image/*" />
              {formData.variants.length > 1 && (
                <button type="button" onClick={() => removeVariantRow(index)} className="bg-red-500 text-white px-2 rounded text-xs">X</button>
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={addVariantRow} className="text-sm text-pink-600 hover:text-pink-800">+ Add Variant</button>

        <div className="mt-6 flex gap-2">
          <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Tabel Produk */}
      {loading ? (
        <div className="text-center p-6 text-gray-600">Loading products...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Main Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants (Price/Stock)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    {product.main_image ? (
                      <img src={`http://localhost:8000/storage/${product.main_image}`} alt={product.product_name} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.product_name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    {product.variants.map(variant => (
                      <div key={variant.id} className="text-sm text-gray-700">
                        {variant.variant_name}: Rp {Number(variant.price).toLocaleString('id-ID')} ({variant.stock} pcs)
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default ProductManagement;