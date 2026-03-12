import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";

const DEFAULT_VARIANT = {
  variant_name: "",
  price: "",
  stock: "",
  sku: "",
  detail_image: null,
};

const DEFAULT_FORM = {
  product_name: "",
  category_id: "",
  description: "",
  main_image: null,
  variants: [DEFAULT_VARIANT],
};

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    status: "active",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/products", { params: filters });

      const { data } = response.data;

      setProducts(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "main_image") {
      setFormData((prev) => ({
        ...prev,
        main_image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => {
      const variants = [...prev.variants];

      variants[index][name] =
        name === "detail_image" ? files[0] : value;

      return { ...prev, variants };
    });
  };

  const addVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...DEFAULT_VARIANT }],
    }));
  };

  const removeVariantRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    data.append("product_name", formData.product_name);
    data.append("category_id", formData.category_id);
    data.append("description", formData.description || "");

    if (formData.main_image) {
      data.append("main_image", formData.main_image);
    }

    formData.variants.forEach((variant, index) => {
      if (variant.id) {
        data.append(`variants[${index}][id]`, variant.id);
      }

      data.append(`variants[${index}][variant_name]`, variant.variant_name);
      data.append(`variants[${index}][price]`, variant.price);
      data.append(`variants[${index}][stock]`, variant.stock);
      data.append(`variants[${index}][sku]`, variant.sku || "");

      if (variant.detail_image) {
        data.append(`variants[${index}][detail_image]`, variant.detail_image);
      }
    });

    if (editingId) {
      data.append("_method", "PUT");
    }

    try {
      const url = editingId
        ? `/products/${editingId}`
        : "/products";

      await api.post(url, data, config);

      alert(
        editingId
          ? "Produk berhasil diperbarui"
          : "Produk berhasil ditambahkan"
      );

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error(error.response?.data);
      alert("Terjadi kesalahan saat menyimpan produk");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    const variants = product.variants.length
      ? product.variants.map((v) => ({
          id: v.id,
          variant_name: v.variant_name,
          price: v.price,
          stock: v.stock,
          sku: v.sku,
          detail_image: null,
        }))
      : [{ ...DEFAULT_VARIANT }];

    setFormData({
      product_name: product.product_name,
      category_id: product.category_id,
      description: product.description,
      main_image: null,
      variants,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus produk?")) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      alert("Produk berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus produk");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">
        Product Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="border p-2 rounded"
            required/>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 rounded col-span-2"/>

          <input
            type="file"
            name="main_image"
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"/>
        </div>

        <h3 className="font-semibold mb-2">Variants</h3>

        {formData.variants.map((variant, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-2 mb-2">
            <input
              name="variant_name"
              value={variant.variant_name}
              onChange={(e) =>
                handleVariantChange(index, e)
              }
              placeholder="Variant"
              className="border p-1"/>

            <input
              type="number"
              name="price"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, e)
              }
              placeholder="Price"
              className="border p-1"/>

            <input
              type="number"
              name="stock"
              value={variant.stock}
              onChange={(e) =>
                handleVariantChange(index, e)
              }
              placeholder="Stock"
              className="border p-1"/>

            <input
              name="sku"
              value={variant.sku}
              onChange={(e) =>
                handleVariantChange(index, e)
              }
              placeholder="SKU"
              className="border p-1"/>

            <div className="flex gap-1">
              <input
                type="file"
                name="detail_image"
                onChange={(e) =>
                  handleVariantChange(index, e)
                }/>

              {formData.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeVariantRow(index)
                  }
                  className="bg-red-500 text-white px-2">
                  X
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariantRow}
          className="text-blue-600 hover:underline">
          + Add Variant
        </button>

        <div className="mt-4 flex gap-2">
          <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-500">
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Variants</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="p-3">
                    <div className="font-semibold">
                      {product.product_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.description}
                    </div>
                  </td>

                  <td className="p-3">
                    {product.variants.map((v) => (
                      <div key={v.id}>
                        {v.variant_name} - Rp{" "}
                        {Number(v.price).toLocaleString(
                          "id-ID"
                        )}{" "}
                        ({v.stock})
                      </div>
                    ))}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() =>
                        handleEdit(product)
                      }
                      className="text-blue-600 hover:underline">
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product.id)
                      }
                      className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 flex justify-between">
            <button
              disabled={pagination.current_page === 1}
              onClick={() =>
                handlePageChange(
                  pagination.current_page - 1)
                }>
              Prev
            </button>

            <button
              disabled={
                pagination.current_page ===
                pagination.last_page
              }
              onClick={() =>
                handlePageChange(
                  pagination.current_page + 1)
                }>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;